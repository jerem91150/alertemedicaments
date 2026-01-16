import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales - MediTrouve",
  description: "Mentions legales d'MediTrouve",
};

export default function MentionsLegalesPage() {
  return (
    <article className="prose prose-teal max-w-none">
      <h1>Mentions legales</h1>
      <p className="lead">Derniere mise a jour : Janvier 2025</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
        <p className="text-amber-800 font-semibold mb-2">AVERTISSEMENT</p>
        <p className="text-amber-700 text-sm mb-0">
          MediTrouve est un service d&apos;information et <strong>ne constitue pas un dispositif
          medical</strong> au sens du Reglement (UE) 2017/745. Les informations fournies ne
          remplacent pas l&apos;avis d&apos;un professionnel de sante.
        </p>
      </div>

      <h2>1. Editeur du site</h2>
      <p>
        Le site MediTrouve est edite par :<br />
        <strong>[Nom de la societe]</strong><br />
        [Forme juridique]<br />
        Siege social : [Adresse]<br />
        RCS : [Numero RCS]<br />
        SIRET : [Numero SIRET]<br />
        TVA intracommunautaire : [Numero TVA]<br />
        Email : contact@meditrouve.fr
      </p>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est [Nom du Directeur].
      </p>

      <h2>3. Hebergement</h2>
      <p>
        Le site web est heberge par :<br />
        <strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133<br />
        Walnut, CA 91789, USA<br />
        https://vercel.com
      </p>

      <h2>4. Nature du service</h2>
      <p className="font-semibold text-rose-700">
        IMPORTANT :
      </p>
      <ul>
        <li>
          <strong>MediTrouve n&apos;est PAS un dispositif medical</strong> au sens du
          Reglement (UE) 2017/745 relatif aux dispositifs medicaux.
        </li>
        <li>
          Ce service est un <strong>outil d&apos;information</strong> destine a faciliter
          le suivi de la disponibilite des medicaments.
        </li>
        <li>
          Les informations fournies <strong>ne constituent pas un avis medical</strong>,
          un diagnostic ou une recommandation therapeutique.
        </li>
        <li>
          <strong>Consultez toujours un professionnel de sante</strong> (medecin, pharmacien)
          pour toute question concernant votre traitement.
        </li>
        <li>
          <strong>En cas d&apos;urgence medicale</strong>, contactez le 15 (SAMU) ou le 112.
        </li>
      </ul>

      <h2>5. Source des donnees</h2>
      <p>
        Les informations relatives a la disponibilite des medicaments sont issues
        des donnees publiques de l&apos;<strong>ANSM</strong> (Agence Nationale de Securite
        du Medicament et des produits de sante).
      </p>
      <p>
        <strong>Site officiel de l&apos;ANSM :</strong>{" "}
        <a href="https://ansm.sante.fr" target="_blank" rel="noopener noreferrer">
          https://ansm.sante.fr
        </a>
      </p>
      <p>
        MediTrouve n&apos;est pas affilie a l&apos;ANSM et n&apos;est pas un service officiel
        de l&apos;administration francaise. Les donnees sont mises a jour quotidiennement
        mais peuvent comporter un decalage par rapport aux donnees officielles.
      </p>

      <h2>6. Limitation de responsabilite</h2>
      <p>
        MediTrouve est un service d&apos;information et d&apos;alerte. Les informations
        fournies le sont a titre indicatif et peuvent comporter des erreurs ou retards
        par rapport aux donnees officielles.
      </p>
      <p>
        En cas de doute sur la disponibilite d&apos;un medicament, nous vous recommandons
        de contacter directement votre pharmacie ou l&apos;ANSM.
      </p>
      <p className="font-semibold">
        Ce service ne remplace en aucun cas l&apos;avis d&apos;un professionnel de sante.
        Ne modifiez jamais votre traitement sans consulter votre medecin ou pharmacien.
      </p>

      <h2>7. Donnees personnelles et securite</h2>
      <p>
        Conformement au Reglement General sur la Protection des Donnees (RGPD),
        vous disposez des droits suivants :
      </p>
      <ul>
        <li>Droit d&apos;acces a vos donnees</li>
        <li>Droit de rectification</li>
        <li>Droit a l&apos;effacement (droit a l&apos;oubli)</li>
        <li>Droit a la portabilite de vos donnees</li>
        <li>Droit d&apos;opposition au traitement</li>
      </ul>
      <p>
        Les donnees sont stockees de maniere securisee avec chiffrement.
        Pour exercer vos droits ou pour toute question relative a vos donnees,
        contactez-nous a : contact@meditrouve.fr
      </p>
      <p>
        Pour plus d&apos;informations, consultez notre{" "}
        <a href="/confidentialite">Politique de confidentialite</a>.
      </p>

      <h2>8. Propriete intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu du site MediTrouve (textes, graphismes, logos,
        icones, images, logiciels) est protege par le droit d&apos;auteur et le
        droit des marques. Toute reproduction, representation, modification,
        publication, transmission ou denaturation, totale ou partielle, sans
        autorisation prealable est interdite.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Le site utilise des cookies strictement necessaires au fonctionnement
        du service (authentification, preferences). Aucun cookie publicitaire
        ou de tracking n&apos;est utilise.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question concernant ces mentions legales :<br />
        Email : contact@meditrouve.fr
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les presentes mentions legales sont soumises au droit francais.
        Tout litige relatif a l&apos;utilisation du site sera soumis a la
        competence exclusive des tribunaux francais.
      </p>
    </article>
  );
}
