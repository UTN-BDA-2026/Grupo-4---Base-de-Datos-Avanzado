from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_delete_userlibrary'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE users_listeninghistory
                DROP FOREIGN KEY users_listeninghistory_song_id_9b2fb094_fk_music_song_id;
            """,
            reverse_sql="""
                ALTER TABLE users_listeninghistory
                ADD CONSTRAINT users_listeninghistory_song_id_9b2fb094_fk_music_song_id
                FOREIGN KEY (song_id) REFERENCES music_song(id);
            """,
        ),
        migrations.RunSQL(
            sql="""
                ALTER TABLE users_listeninghistory
                DROP FOREIGN KEY users_listeninghistory_user_id_05da96fb_fk_users_user_id;
            """,
            reverse_sql="""
                ALTER TABLE users_listeninghistory
                ADD CONSTRAINT users_listeninghistory_user_id_05da96fb_fk_users_user_id
                FOREIGN KEY (user_id) REFERENCES users_user(id);
            """,
        ),
        migrations.RunSQL(
            sql="""
                ALTER TABLE users_listeninghistory
                DROP PRIMARY KEY,
                ADD PRIMARY KEY (id, played_at);
            """,
            reverse_sql="""
                ALTER TABLE users_listeninghistory
                DROP PRIMARY KEY,
                ADD PRIMARY KEY (id);
            """,
        ),
        migrations.RunSQL(
            sql="""
                ALTER TABLE users_listeninghistory
                PARTITION BY RANGE (TO_DAYS(played_at)) (
                    PARTITION p2025 VALUES LESS THAN (TO_DAYS('2026-01-01')),
                    PARTITION p2026_s1 VALUES LESS THAN (TO_DAYS('2026-07-01')),
                    PARTITION p2026_s2 VALUES LESS THAN (TO_DAYS('2027-01-01')),
                    PARTITION pmax VALUES LESS THAN MAXVALUE
                );
            """,
            reverse_sql="""
                ALTER TABLE users_listeninghistory REMOVE PARTITIONING;
            """,
        ),
    ]