using System;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Documents;
using BulletinBoardServiceContract;

namespace Client
{
    /// <inheritdoc cref="Window" />
    /// <summary>
    ///     Interaction logic for BulletinBoardWindow.xaml
    /// </summary>
    public partial class BulletinBoardWindow
    {
        public BulletinBoardWindow(string username, string email, IBulletinBoardService bulletinBoardService)
        {
            InitializeComponent();
            Username = username;
            Email = email;
            var updateThread = new Thread(UpdateThread);

            BulletinBoardService = new SafeBulletinBoardService(bulletinBoardService, s =>
            {
                Dispatcher.Invoke(() =>
                {
                    updateThread.Abort();
                    var connectionWindow = new ConnectionWindow {ErrorTextBlock = {Text = s}};
                    connectionWindow.Show();
                    Close();
                });
            });
            DataContext = this;

            updateThread.Start();
        }

        public ObservableCollection<Announcement> Announcements { get; set; } =
            new ObservableCollection<Announcement>();

        public string Username { get; }
        public string Email { get; }
        public IBulletinBoardService BulletinBoardService { get; }

        private void UpdateThread()
        {
            while (true)
            {
                var announcements = BulletinBoardService.GetAnnouncements();
                try
                {
                    Dispatcher.Invoke(() =>
                    {
                        foreach (var announcement in announcements)
                        {
                            if (!Announcements.Contains(announcement))
                            {
                                AddAnnouncement(announcement);
                            }
                        }
                    });
                }
                catch (TaskCanceledException)
                {
                    break;
                }

                Thread.Sleep(1000);
            }
        }

        private void AddAnnouncement(Announcement announcement)
        {
            Announcements.Add(announcement);
            Announcements.Sort(AnnouncementComparison);
        }

        private static int AnnouncementComparison(Announcement leftAnnouncement, Announcement rightAnnouncement)
        {
            return rightAnnouncement.DateTime.CompareTo(leftAnnouncement.DateTime);
        }


        private void PublishButton_OnClick(object sender, RoutedEventArgs e)
        {
            var announcement = new Announcement
            {
                Title = TitleTextBox.Text,
                Body = new TextRange(BodyRichTextBox.Document.ContentStart, BodyRichTextBox.Document.ContentEnd).Text,
                Username = Username,
                Email = Email,
                DateTime = DateTime.UtcNow
            };
            BulletinBoardService.Publish(announcement);
        }
    }
}
