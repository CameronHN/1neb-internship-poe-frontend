import { API_URLS } from "../constants/apiConstants";
import type { AddCertification, Certification } from "../types/certificationTypes";

class CertificationService {
    /**
     * Delete multiple certifications by their IDs
     * @param certificationIds Array of certification IDs to delete
     * @returns Promise<void>
     */
    async deleteCertifications(certificationIds: string[]): Promise<void> {
        if (!certificationIds || certificationIds.length === 0) {
            throw new Error("No certification IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Certification/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(certificationIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete certifications");
        }
    }

    async addCertifications(certifications: AddCertification[]): Promise<void> {
        if (!certifications || certifications.length === 0) {
            throw new Error("No certifications provided");
        }

        // Transform certifications to the expected API format
        const certData = certifications.map(certification => ({
            certificationName: certification.certificationName,
            issuingOrganisation: certification.issuingOrganisation,
            credentialUrl: certification.credentialUrl,
            issuedDate: certification.issuedDate,
            expiryDate: certification.expiryDate
        }));

        const response = await fetch(
            `${API_URLS.API_BASE}/Certification/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(certData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add certifications");
        }
    }

    async getCertificationById(id: string): Promise<Certification> {
        if (!id) {
            throw new Error("No certification ID provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Certification/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch certification");
        }

        return await response.json();
    }

    async updateCertification(certification: Certification): Promise<void> {
        if (!certification) {
            throw new Error("No certification provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Certification/patch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(certification),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update certification");
        }
    }
}

export const certificationService = new CertificationService();
