import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - MediTrouve",
  description: "Politique de confidentialité et protection des données personnelles d'MediTrouve",
};

export default function ConfidentialitePage() {
  return (
    <article className="prose prose-teal max-w-none">
      <h1>Politique de Confidentialité</h1>
      <p className="lead">Dernière mise à jour : Janvier 2025</p>

      <div className="bg-teal-50 p-4 rounded-lg not-prose mb-8">
        <p className="text-sm text-teal-800">
          <strong>En résumé :</strong> Nous collectons uniquement les données nécessaires au fonctionnement du service.
          Nous ne vendons jamais vos données. Vous gardez le contrôle total sur vos informations.
        </p>
      </div>

      <h2>1. Responsable du traitement</h2>
      <p>
        MediTrouve est édité par [Votre Société], immatriculée sous le numéro [SIRET],
        dont le siège social est situé [Adresse].
      </p>
      <p>
        <strong>Délégué à la Protection des Données (DPO)</strong><br />
        Email : dpo@meditrouve.fr
      </p>

      <h2>2. Données collectées et finalités</h2>

      <h3>2.1 Données de compte (obligatoires)</h3>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Adresse email</td>
            <td>Identification, notifications</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Mot de passe (hashé)</td>
            <td>Authentification sécurisée</td>
            <td>Exécution du contrat</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Données de compte (optionnelles)</h3>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nom</td>
            <td>Personnalisation</td>
            <td>Consentement</td>
          </tr>
          <tr>
            <td>Téléphone</td>
            <td>Alertes SMS (si activé)</td>
            <td>Consentement</td>
          </tr>
        </tbody>
      </table>

      <h3>2.3 Données de santé</h3>
      <div className="bg-amber-50 p-4 rounded-lg not-prose my-4">
        <p className="text-sm text-amber-800">
          <strong>Important :</strong> Les médicaments que vous suivez sont des données de santé
          au sens du RGPD (Article 9). Nous les traitons avec une protection renforcée.
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Médicaments suivis</td>
            <td>Alertes de rupture</td>
            <td>Consentement explicite</td>
          </tr>
          <tr>
            <td>Rappels de prise</td>
            <td>Suivi thérapeutique</td>
            <td>Consentement explicite</td>
          </tr>
          <tr>
            <td>Ordonnances scannées</td>
            <td>Import automatique</td>
            <td>Consentement explicite</td>
          </tr>
          <tr>
            <td>Profils famille</td>
            <td>Gestion multi-patients</td>
            <td>Consentement explicite</td>
          </tr>
        </tbody>
      </table>

      <h3>2.4 Données techniques</h3>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Adresse IP</td>
            <td>Sécurité, anti-fraude</td>
            <td>Intérêt légitime</td>
          </tr>
          <tr>
            <td>Logs de connexion</td>
            <td>Audit de sécurité</td>
            <td>Obligation légale</td>
          </tr>
          <tr>
            <td>Token push</td>
            <td>Notifications mobiles</td>
            <td>Consentement</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Durées de conservation</h2>
      <table>
        <thead>
          <tr>
            <th>Type de donnée</th>
            <th>Durée de conservation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Données de compte</td>
            <td>Durée de vie du compte + 30 jours</td>
          </tr>
          <tr>
            <td>Données de santé</td>
            <td>Durée de vie du compte + 30 jours</td>
          </tr>
          <tr>
            <td>Historique de recherche</td>
            <td>12 mois</td>
          </tr>
          <tr>
            <td>Logs de sécurité</td>
            <td>12 mois (obligation légale)</td>
          </tr>
          <tr>
            <td>Données de facturation</td>
            <td>10 ans (obligation comptable)</td>
          </tr>
          <tr>
            <td>Consentement cookies</td>
            <td>13 mois</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Partage et sous-traitants</h2>
      <p>
        <strong>Nous ne vendons jamais vos données.</strong> Elles peuvent être partagées avec :
      </p>
      <table>
        <thead>
          <tr>
            <th>Sous-traitant</th>
            <th>Finalité</th>
            <th>Localisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vercel</td>
            <td>Hébergement</td>
            <td>UE (Francfort)</td>
          </tr>
          <tr>
            <td>Supabase / PlanetScale</td>
            <td>Base de données</td>
            <td>UE</td>
          </tr>
          <tr>
            <td>Stripe</td>
            <td>Paiements</td>
            <td>UE + USA (clauses contractuelles types)</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Emails transactionnels</td>
            <td>USA (clauses contractuelles types)</td>
          </tr>
          <tr>
            <td>Firebase (Google)</td>
            <td>Notifications push</td>
            <td>UE + USA (clauses contractuelles types)</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Transferts hors UE</h2>
      <p>
        Certains de nos sous-traitants sont basés aux États-Unis. Ces transferts sont encadrés par :
      </p>
      <ul>
        <li>Les Clauses Contractuelles Types (CCT) de la Commission européenne</li>
        <li>Le Data Privacy Framework UE-USA (pour les entreprises certifiées)</li>
      </ul>

      <h2>6. Vos droits (RGPD)</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>

      <h3>6.1 Droit d&apos;accès (Article 15)</h3>
      <p>Vous pouvez demander une copie de toutes vos données personnelles.</p>
      <p><strong>Comment :</strong> Paramètres → Mes données → Exporter</p>

      <h3>6.2 Droit de rectification (Article 16)</h3>
      <p>Vous pouvez corriger vos informations à tout moment.</p>
      <p><strong>Comment :</strong> Paramètres → Profil → Modifier</p>

      <h3>6.3 Droit à l&apos;effacement (Article 17)</h3>
      <p>Vous pouvez supprimer votre compte et toutes vos données.</p>
      <p><strong>Comment :</strong> Paramètres → Compte → Supprimer mon compte</p>
      <p>Délai de suppression : 30 jours (pour permettre une annulation)</p>

      <h3>6.4 Droit à la portabilité (Article 20)</h3>
      <p>Vous pouvez exporter vos données dans un format lisible (JSON).</p>
      <p><strong>Comment :</strong> Paramètres → Mes données → Exporter</p>

      <h3>6.5 Droit d&apos;opposition (Article 21)</h3>
      <p>Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.</p>
      <p><strong>Contact :</strong> dpo@meditrouve.fr</p>

      <h3>6.6 Droit de retirer votre consentement</h3>
      <p>Pour les traitements basés sur le consentement, vous pouvez le retirer à tout moment.</p>

      <h2>7. Sécurité des données</h2>
      <p>Nous mettons en œuvre les mesures suivantes :</p>
      <ul>
        <li><strong>Chiffrement en transit</strong> : HTTPS/TLS 1.3 sur toutes les connexions</li>
        <li><strong>Chiffrement au repos</strong> : Données sensibles chiffrées en base</li>
        <li><strong>Authentification</strong> : Mots de passe hashés avec bcrypt</li>
        <li><strong>Contrôle d&apos;accès</strong> : Principe du moindre privilège</li>
        <li><strong>Surveillance</strong> : Logs d&apos;audit des accès aux données</li>
        <li><strong>Sauvegardes</strong> : Quotidiennes, chiffrées, géo-répliquées</li>
      </ul>

      <h2>8. Cookies</h2>
      <p>Nous utilisons les cookies suivants :</p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Type</th>
            <th>Durée</th>
            <th>Finalité</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>next-auth.session-token</td>
            <td>Essentiel</td>
            <td>Session</td>
            <td>Authentification</td>
          </tr>
          <tr>
            <td>cookie_consent</td>
            <td>Essentiel</td>
            <td>13 mois</td>
            <td>Préférences cookies</td>
          </tr>
        </tbody>
      </table>
      <p>Vous pouvez gérer vos préférences via la bannière cookies.</p>

      <h2>9. Mineurs</h2>
      <p>
        MediTrouve n&apos;est pas destiné aux mineurs de moins de 16 ans.
        Si vous êtes parent et pensez que votre enfant nous a fourni des données,
        contactez-nous pour les supprimer.
      </p>

      <h2>10. Modifications de cette politique</h2>
      <p>
        Nous pouvons mettre à jour cette politique. En cas de changement significatif,
        vous serez notifié par email au moins 30 jours avant l&apos;entrée en vigueur.
      </p>

      <h2>11. Contact et réclamations</h2>
      <p>
        <strong>Pour exercer vos droits ou poser des questions :</strong><br />
        Email : dpo@meditrouve.fr<br />
        Délai de réponse : 30 jours maximum
      </p>
      <p>
        <strong>Réclamation auprès de l&apos;autorité de contrôle :</strong><br />
        CNIL - Commission Nationale de l&apos;Informatique et des Libertés<br />
        3 Place de Fontenoy, 75007 Paris<br />
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>
    </article>
  );
}
