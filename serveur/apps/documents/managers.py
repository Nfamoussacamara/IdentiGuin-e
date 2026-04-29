from django.db import models

class DemandeQuerySet(models.QuerySet):
    """
    QuerySet personnalisé permettant d'ajouter des méthodes de filtrage 
    et d'optimisation chaînables sur le modèle DemandeDocument.
    """

    def optimisé(self):
        """
        Préchit le citoyen associé à chaque demande.
        Utilise 'select_related' pour effectuer une jointure SQL (JOIN),
        évitant ainsi une requête supplémentaire pour chaque citoyen affiché.
        """
        return self.select_related('citoyen')

    def prets(self):
        """Filtre uniquement les documents prêts au téléchargement."""
        return self.filter(statut='PRET')

    def recents(self):
        """Trie les demandes par date de création, de la plus récente à la plus ancienne."""
        return self.order_by('-created_at')


class DemandeManager(models.Manager):
    """
    Manager métier pour les documents.
    Il sert d'interface principale pour interagir avec la base de données.
    """

    def get_queryset(self):
        """Initialise le QuerySet personnalisé pour toutes les requêtes du manager."""
        return DemandeQuerySet(self.model, using=self._db)

    def tout_optimisé(self):
        """
        Raccourci pour récupérer toutes les demandes avec préchargement des citoyens.
        Exemple d'usage : DemandeDocument.objects.tout_optimisé()
        """
        return self.get_queryset().optimisé().recents()

    def pour_citoyen(self, citoyen):
        """Récupère toutes les demandes d'un citoyen spécifique, optimisées."""
        return self.get_queryset().filter(citoyen=citoyen).optimisé().recents()
