from django.db import models

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Location(models.Model):
    FOREST = 'Forest'
    DESERT = 'Desert'
    DUNGEON = 'Dungeon'
    RIVER = 'River'
    OCEAN = 'Ocean'
    LOCATION_TYPES = (
        (FOREST, FOREST),
        (DESERT, DESERT),
        (DUNGEON, DUNGEON),
        (RIVER, RIVER),
        (OCEAN, OCEAN),
    )
    location_id = models.CharField(max_length=10,  unique=True)
    description = models.TextField()
    location_type = models.CharField(max_length=10, choices=LOCATION_TYPES)

    def __str__(self):
        return self.location_id


class Player(models.Model):
    KNIGHT = 'Knight'
    WIZARD = 'Wizard'
    THIEF = 'Thief'
    PALADIN = 'Paladin'
    PLAYER_CLASSES = (
        (KNIGHT, KNIGHT),
        (WIZARD, WIZARD),
        (THIEF, THIEF),
        (PALADIN, PALADIN),
    )
    name = models.CharField(max_length=30, unique=True)
    player_class = models.CharField(max_length=10, choices=PLAYER_CLASSES)
    email = models.EmailField()
    level = models.IntegerField()
    position = models.ForeignKey('Location', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Message(models.Model):
    player_from = models.ForeignKey(
        'Player', on_delete=models.CASCADE, related_name='received_messages')
    player_to = models.ForeignKey(
        'Player', on_delete=models.CASCADE, related_name='sent_messages')
    text = models.CharField(max_length=1000)

    def __str__(self):
        return 'Message from {} to {}'.format(self)
