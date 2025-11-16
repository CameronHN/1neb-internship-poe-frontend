export interface AddCertification {
    certificationName: string;
    issuingOrganisation: string;
    credentialUrl: string | null;
    issuedDate: string | null;
    expiryDate: string | null;
}

export interface UpdateCertification extends AddCertification {
    id: string;
}

export interface Certification {
    id: string;
    certificationName: string;
    issuingOrganisation: string;
    credentialUrl: string | null;
    issuedDate: string | null;
    expiryDate: string | null;
}