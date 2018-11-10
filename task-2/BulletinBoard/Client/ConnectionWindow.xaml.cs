using System;
using System.ServiceModel;
using System.Windows;
using BulletinBoardServiceContract;

namespace Client
{
    public partial class ConnectionWindow
    {
        public ConnectionWindow()
        {
            InitializeComponent();
        }

        private static void ThrowIfNullOrEmpty(string name, string value)
        {
            if (value == null) throw new ArgumentNullException(nameof(value));
            if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException($"{name} can't be empty");
        }

        private static T CreateChannel<T>(string host, int port)
        {
            var address = new Uri($"http://{host}:{port}/{typeof(T).Name}");
            var binding = new BasicHttpBinding();
            var endpoint = new EndpointAddress(address);

            var factory = new ChannelFactory<T>(binding, endpoint);
            return factory.CreateChannel();
        }

        private void ConnectButton_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                var username = UsernameTextBox.Text;
                ThrowIfNullOrEmpty("Username", username);
                var email = EmailTextBox.Text;
                ThrowIfNullOrEmpty("Email", email);
                var host = HostTextBox.Text;
                ThrowIfNullOrEmpty("Host", host);
                var portString = PortTextBox.Text;
                ThrowIfNullOrEmpty("Port", portString);
                if (!int.TryParse(portString, out var port)) throw new ArgumentException("Port is invalid");
                var channel = CreateChannel<IBulletinBoardService>(host, port);
                if (channel.Ping() != "Pong") throw new CommunicationException("Invalid ping response");
                ErrorTextBlock.Text = string.Empty;
                var bulletinBoard = new BulletinBoardWindow(username, email, channel);
                bulletinBoard.Show();
                Close();
            }
            catch (Exception exception)
            {
                ErrorTextBlock.Text = exception.Message;
            }
        }
    }
}
