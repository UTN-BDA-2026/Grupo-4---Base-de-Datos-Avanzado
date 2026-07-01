from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_listeninghistory_song_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE users_listeninghistory
                PARTITION BY RANGE COLUMNS (played_at) (
                    PARTITION p2025 VALUES LESS THAN ('2026-01-01 00:00:00'),
                    PARTITION p2026_s1 VALUES LESS THAN ('2026-07-01 00:00:00'),
                    PARTITION p2026_s2 VALUES LESS THAN ('2027-01-01 00:00:00'),
                    PARTITION pmax VALUES LESS THAN (MAXVALUE)
                );
            """,
            reverse_sql="""
                ALTER TABLE users_listeninghistory
                PARTITION BY RANGE (TO_DAYS(played_at)) (
                    PARTITION p2025 VALUES LESS THAN (TO_DAYS('2026-01-01')),
                    PARTITION p2026_s1 VALUES LESS THAN (TO_DAYS('2026-07-01')),
                    PARTITION p2026_s2 VALUES LESS THAN (TO_DAYS('2027-01-01')),
                    PARTITION pmax VALUES LESS THAN MAXVALUE
                );
            """,
        ),
    ]