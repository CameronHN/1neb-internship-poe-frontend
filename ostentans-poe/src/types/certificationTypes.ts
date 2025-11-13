export interface Certification {
    certificationName: string;
    issuingOrganisation: string;
    credentialUrl: string | null;
    issuedDate: string | null;
    expiryDate: string | null;
}