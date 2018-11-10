using System;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Description;
using BulletinBoardServiceContract;
using Npgsql;
using Server.Services;

namespace Server
{
    internal class Program
    {
        internal static NpgsqlConnection NpgsqlConnection;
        internal static object Locker = new object();

        private static void Main()
        {
            var connString = File.ReadAllText("connection.data");
            NpgsqlConnection = new NpgsqlConnection(connString);
            NpgsqlConnection.Open();
            var variables = Environment.GetEnvironmentVariables();
            var port = 8555;
            if (variables.Contains("PORT")) port = int.Parse((string) variables[port]);
            Console.Title = $"Bulletin Board Service :{port}";
             
            var address = new Uri($"http://localhost:{port}/IBulletinBoardService");
            var binding = new BasicHttpBinding();
            var contract = typeof(IBulletinBoardService);

            var host = new ServiceHost(typeof(BulletinBoardService));

            var debug = host.Description.Behaviors.Find<ServiceDebugBehavior>();
            if (debug == null)
            {
                host.Description.Behaviors.Add(
                    new ServiceDebugBehavior {IncludeExceptionDetailInFaults = true});
            }
            else
            {
                if (!debug.IncludeExceptionDetailInFaults) debug.IncludeExceptionDetailInFaults = true;
            }

            host.AddServiceEndpoint(contract, binding, address);
            host.Open();
            Console.WriteLine($"Service is listening on port {port}");
            Console.WriteLine("Press <Enter> button to stop server");
            Console.ReadLine();
            host.Close();
            NpgsqlConnection.Close();
        }
    }
}
