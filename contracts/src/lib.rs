//! Tuishare Sponsorship Contract
//!
//! Manages education sponsorships on Stellar (Soroban).
//! Sponsors lock funds that are released only to a verified institution address,
//! not directly to the student — preventing misuse and fraud.
//!
//! Flow:
//!   1. Admin registers a student with their institution address and amount needed.
//!   2. Sponsor calls `fund()` to commit USDC.
//!   3. Admin calls `release()` once institution confirms enrollment.
//!   4. Funds transfer from contract escrow to the institution address.

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, symbol_short
};

// ── Storage keys ──────────────────────────────────────────────────────────────

const ADMIN_KEY: Symbol = symbol_short!("ADMIN");

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Student(Symbol),     // keyed by student ID
    Sponsorship(Symbol), // keyed by sponsorship ID
}

// ── Data types ────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum SponsorshipStatus {
    Pending,
    Funded,
    Released,
    Cancelled,
}

#[contracttype]
#[derive(Clone)]
pub struct Student {
    pub id: Symbol,
    pub institution: Address, // funds will be sent HERE, not to student
    pub amount_needed: i128,
    pub amount_raised: i128,
    pub verified: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Sponsorship {
    pub id: Symbol,
    pub student_id: Symbol,
    pub sponsor: Address,
    pub amount: i128,
    pub token: Address,
    pub status: SponsorshipStatus,
}

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct TuishareContract;

#[contractimpl]
impl TuishareContract {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    /// Register a verified student (admin only).
    pub fn register_student(
        env: Env,
        student_id: Symbol,
        institution: Address,
        amount_needed: i128,
    ) {
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        admin.require_auth();

        assert!(amount_needed > 0, "amount must be positive");

        let student = Student {
            id: student_id.clone(),
            institution,
            amount_needed,
            amount_raised: 0,
            verified: true,
        };
        env.storage().persistent().set(&DataKey::Student(student_id), &student);
    }

    /// Sponsor funds a student. Transfers token from sponsor to this contract (escrow).
    pub fn fund(
        env: Env,
        sponsorship_id: Symbol,
        student_id: Symbol,
        sponsor: Address,
        token: Address,
        amount: i128,
    ) {
        sponsor.require_auth();
        assert!(amount > 0, "amount must be positive");

        let mut student: Student = env
            .storage()
            .persistent()
            .get(&DataKey::Student(student_id.clone()))
            .expect("student not found");

        assert!(student.verified, "student is not verified");

        // Transfer USDC from sponsor into this contract's escrow
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sponsor, &env.current_contract_address(), &amount);

        student.amount_raised += amount;
        env.storage().persistent().set(&DataKey::Student(student_id.clone()), &student);

        let sponsorship = Sponsorship {
            id: sponsorship_id.clone(),
            student_id,
            sponsor,
            amount,
            token,
            status: SponsorshipStatus::Funded,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Sponsorship(sponsorship_id), &sponsorship);
    }

    /// Release escrowed funds to the institution (admin only).
    pub fn release(env: Env, sponsorship_id: Symbol) {
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        admin.require_auth();

        let mut sponsorship: Sponsorship = env
            .storage()
            .persistent()
            .get(&DataKey::Sponsorship(sponsorship_id.clone()))
            .expect("sponsorship not found");

        assert!(
            sponsorship.status == SponsorshipStatus::Funded,
            "sponsorship is not in funded state"
        );

        let student: Student = env
            .storage()
            .persistent()
            .get(&DataKey::Student(sponsorship.student_id.clone()))
            .expect("student not found");

        // Send directly to institution — never to student wallet
        let token_client = token::Client::new(&env, &sponsorship.token);
        token_client.transfer(
            &env.current_contract_address(),
            &student.institution,
            &sponsorship.amount,
        );

        sponsorship.status = SponsorshipStatus::Released;
        env.storage()
            .persistent()
            .set(&DataKey::Sponsorship(sponsorship_id), &sponsorship);
    }

    /// Read a student record.
    pub fn get_student(env: Env, student_id: Symbol) -> Student {
        env.storage()
            .persistent()
            .get(&DataKey::Student(student_id))
            .expect("student not found")
    }

    /// Read a sponsorship record.
    pub fn get_sponsorship(env: Env, sponsorship_id: Symbol) -> Sponsorship {
        env.storage()
            .persistent()
            .get(&DataKey::Sponsorship(sponsorship_id))
            .expect("sponsorship not found")
    }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, TuishareContract);
        let client = TuishareContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);
    }
}
