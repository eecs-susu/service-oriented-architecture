using System.Collections.Generic;
using System.ServiceModel;

namespace BulletinBoardServiceContract
{
    [ServiceContract]
    public interface IBulletinBoardService
    {
        [OperationContract]
        string Ping();

        [OperationContract]
        void Publish(Announcement announcement);

        [OperationContract]
        List<Announcement> GetAnnouncements();
    }
}
