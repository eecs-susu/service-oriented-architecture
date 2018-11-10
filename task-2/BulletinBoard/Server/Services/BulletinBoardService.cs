using BulletinBoardServiceContract;
using Npgsql;
using System;
using System.Collections.Generic;
using System.ServiceModel;


namespace Server.Services
{
    [ServiceBehavior(ConcurrencyMode = ConcurrencyMode.Single, InstanceContextMode = InstanceContextMode.Single)]
    public class BulletinBoardService : IBulletinBoardService
    {
        private readonly List<Announcement> _announcements = new List<Announcement>();

        public BulletinBoardService()
        {
            using (var cmd = new NpgsqlCommand("select * from announcements", Program.NpgsqlConnection))
            {
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        _announcements.Add(new Announcement
                        {
                            Title = reader.GetString(1),
                            Body = reader.GetString(2),
                            Username = reader.GetString(3),
                            Email = reader.GetString(4),
                            DateTime = Tools.ConvertFromUnixTimestamp(reader.GetDouble(5))
                        });
                    }
                }
            }
        }

        public string Ping()
        {
            return "Pong";
        }

        public void Publish(Announcement announcement)
        {
            announcement.DateTime = DateTime.UtcNow;
            string query = "insert into announcements (title, body, username, email, timestamp) " +
                        "values (" +
                        $"'{announcement.Title}'," +
                        $"'{announcement.Body}'," +
                        $"'{announcement.Username}'," +
                        $"'{announcement.Email}'," +
                        $"{Tools.ConvertToUnixTimestamp(announcement.DateTime)}" +
                        $")";
            lock (Program.Locker)
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand(query, Program.NpgsqlConnection))
                {
                    cmd.ExecuteNonQuery();
                }
                _announcements.Add(announcement);
            }

            Console.WriteLine($"Publish {announcement.Title} from {announcement.Username}");
        }


        public List<Announcement> GetAnnouncements()
        {
            lock (Program.Locker)
            {
                return _announcements;
            }
        }

        private List<Announcement> LoadAnnouncements()
        {
            List<Announcement> announcements = new List<Announcement>();
            lock (Program.Locker)
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand("select * from announcements", Program.NpgsqlConnection))
                {
                    using (NpgsqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            announcements.Add(new Announcement
                            {
                                Title = reader.GetString(1),
                                Body = reader.GetString(2),
                                Username = reader.GetString(3),
                                Email = reader.GetString(4),
                                DateTime = Tools.ConvertFromUnixTimestamp(reader.GetDouble(5))
                            });
                        }
                    }


                    return announcements;
                }
            }
        }
    }
}
