# Generated by Django 2.1.3 on 2018-11-07 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('valarmorghulis', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='location_id',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]
