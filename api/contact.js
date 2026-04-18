export default async function handler(req, res) {
    // On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { firstName, lastName, email, device, message } = req.body;

    try {
        // Utilisation directe de l'API REST de Resend (ultra simple, aucun package npm à installer)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Contact Site Web <onboarding@resend.dev>', // Email d'envoi par défaut de Resend
                to: 'contact@lekrepar.fr', // ⚠️ REMPLACEZ par l'adresse où vous voulez recevoir les devis
                reply_to: email, // Vous permet de cliquer sur "Répondre" directement au client dans votre boîte mail
                subject: `Nouveau devis : ${device} de ${firstName} ${lastName}`,
                html: `
                    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #1e3a8a; margin: 0; font-size: 24px;">Le K répare</h2>
                            <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Nouvelle demande depuis le site web</p>
                        </div>
                        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #f3f4f6;">
                            <h3 style="color: #374151; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; font-size: 16px;">Détails du contact</h3>
                            <p style="margin: 10px 0; color: #4b5563;"><strong>Nom :</strong> ${firstName} ${lastName}</p>
                            <p style="margin: 10px 0; color: #4b5563;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
                            <p style="margin: 10px 0; color: #4b5563;"><strong>Appareil concerné :</strong> <span style="background-color: #dbeafe; color: #1e40af; padding: 3px 10px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block;">${device}</span></p>
                        </div>
                        <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px;">
                            <h3 style="color: #374151; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; font-size: 16px;">Message</h3>
                            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 0;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
                            Cet email a été envoyé automatiquement depuis le formulaire de contact de lekrepar.fr
                        </div>
                    </div>
                `
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorData = await response.json();
            return res.status(400).json({ error: errorData });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}