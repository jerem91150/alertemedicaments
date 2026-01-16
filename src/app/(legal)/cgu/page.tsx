import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation - MediTrouve",
  description: "CGU d'MediTrouve",
};

export default function CGUPage() {
  return (
    <article className="prose prose-teal max-w-none">
      <h1>Conditions Generales d&apos;Utilisation</h1>
      <p className="lead">Derniere mise a jour : Janvier 2025</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
        <p className="text-amber-800 font-semibold mb-2">AVERTISSEMENT IMPORTANT</p>
        <p className="text-amber-700 text-sm mb-0">
          MediTrouve est un service d&apos;information et ne constitue pas un dispositif medical
          au sens de la reglementation europeenne. Les informations fournies ne remplacent en
          aucun cas l&apos;avis d&apos;un professionnel de sante.
        </p>
      </div>

      <h2>1. Objet</h2>
      <p>
        Les presentes Conditions Generales d&apos;Utilisation (CGU) definissent les
        modalites d&apos;utilisation du service MediTrouve, plateforme de suivi des
        ruptures et tensions d&apos;approvisionnement de medicaments en France.
      </p>

      <h2>2. Description du service</h2>
      <p>MediTrouve propose :</p>
      <ul>
        <li>Consultation de la liste des medicaments en rupture ou tension</li>
        <li>Recherche de medicaments par nom, laboratoire ou molecule</li>
        <li>Creation d&apos;alertes personnalisees par email</li>
        <li>Notifications lors des changements de disponibilite</li>
        <li>Localisation des pharmacies a proximite</li>
      </ul>

      <h2>3. Offres et tarification</h2>
      <p>MediTrouve propose plusieurs niveaux de service :</p>
      <ul>
        <li><strong>Plan Gratuit :</strong> Fonctionnalites de base (recherche, alertes limitees)</li>
        <li><strong>Plan Premium :</strong> 2,99 EUR/mois ou 23,99 EUR/an - Alertes illimitees, fonctionnalites avancees</li>
        <li><strong>Plan Famille :</strong> 4,99 EUR/mois ou 47,99 EUR/an - Multi-profils, partage avec aidants</li>
      </ul>
      <p>
        Les abonnements payants peuvent etre annules a tout moment. L&apos;acces aux
        fonctionnalites premium reste actif jusqu&apos;a la fin de la periode de facturation.
      </p>

      <h2>4. Source des donnees</h2>
      <p>
        Les informations sur la disponibilite des medicaments proviennent des
        donnees publiques de l&apos;ANSM (Agence Nationale de Securite du Medicament).
        Ces donnees sont mises a jour quotidiennement.
      </p>
      <p>
        MediTrouve n&apos;est pas un service officiel de l&apos;administration
        et ne peut garantir l&apos;exactitude ou l&apos;exhaustivite des informations
        en temps reel.
      </p>

      <h2>5. Nature du service - Avertissement medical</h2>
      <p className="font-semibold text-rose-700">
        IMPORTANT - VEUILLEZ LIRE ATTENTIVEMENT :
      </p>
      <ul>
        <li>
          <strong>MediTrouve n&apos;est PAS un dispositif medical</strong> au sens du
          Reglement (UE) 2017/745 relatif aux dispositifs medicaux.
        </li>
        <li>
          <strong>Les informations fournies sont purement indicatives</strong> et ne
          constituent pas un avis medical, un diagnostic ou une recommandation therapeutique.
        </li>
        <li>
          <strong>Ne modifiez jamais votre traitement</strong> sans consulter au prealable
          un professionnel de sante qualifie (medecin, pharmacien).
        </li>
        <li>
          <strong>En cas d&apos;urgence medicale</strong>, contactez le 15 (SAMU) ou le 112.
        </li>
      </ul>
      <p>
        L&apos;utilisateur reconnait avoir pris connaissance de ces avertissements et les
        accepte en utilisant le service.
      </p>

      <h2>6. Inscription</h2>
      <p>
        La creation d&apos;un compte est necessaire pour configurer des alertes.
        L&apos;utilisateur s&apos;engage a fournir une adresse email valide et des
        informations exactes.
      </p>
      <p>
        L&apos;utilisateur est responsable de la confidentialite de ses identifiants
        de connexion.
      </p>

      <h2>7. Limitation de responsabilite</h2>
      <p>
        MediTrouve fait ses meilleurs efforts pour fournir des informations
        a jour et fiables, mais ne peut garantir :
      </p>
      <ul>
        <li>L&apos;exactitude des informations en temps reel</li>
        <li>La disponibilite permanente du service</li>
        <li>L&apos;envoi de toutes les notifications</li>
        <li>L&apos;absence d&apos;erreurs ou d&apos;interruptions</li>
      </ul>
      <p>
        La societe editrice ne saurait etre tenue responsable des dommages directs
        ou indirects resultant de l&apos;utilisation ou de l&apos;impossibilite d&apos;utiliser
        le service, y compris en cas de retard dans l&apos;envoi des alertes ou
        d&apos;informations erronees.
      </p>

      <h2>8. Donnees personnelles</h2>
      <p>
        Nous collectons uniquement les donnees necessaires au fonctionnement
        du service. Les donnees de sante eventuelles (liste de medicaments suivis)
        sont stockees de maniere securisee et chiffree.
      </p>
      <p>
        Consultez notre <a href="/confidentialite">Politique de confidentialite</a>
        pour plus de details sur le traitement de vos donnees.
      </p>

      <h2>9. Suppression de compte</h2>
      <p>
        Vous pouvez supprimer votre compte et toutes vos donnees a tout moment
        depuis votre profil. La suppression est immediate et irrevocable.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Ces CGU peuvent etre modifiees a tout moment. Les utilisateurs seront
        informes des changements importants par email. La poursuite de l&apos;utilisation
        du service apres modification vaut acceptation des nouvelles conditions.
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Ces CGU sont soumises au droit francais. Tout litige sera soumis aux
        tribunaux competents de Paris.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question : contact@meditrouve.fr
      </p>
    </article>
  );
}
