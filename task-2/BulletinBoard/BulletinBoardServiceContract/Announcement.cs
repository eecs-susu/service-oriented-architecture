using System;
using System.Runtime.Serialization;

namespace BulletinBoardServiceContract
{
    [DataContract(Namespace = "")]
    public class Announcement : MarshalByRefObject, IEquatable<Announcement>
    {
        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public string Email { get; set; }

        [DataMember]
        public string Body { get; set; }

        [DataMember]
        public DateTime DateTime { get; set; }
        public bool Equals(Announcement other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return string.Equals(Title, other.Title) && string.Equals(Username, other.Username) && string.Equals(Email, other.Email) && string.Equals(Body, other.Body) && DateTime.Equals(other.DateTime);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            return obj.GetType() == this.GetType() && Equals((Announcement)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                var hashCode = (Title != null ? Title.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (Username != null ? Username.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (Email != null ? Email.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ (Body != null ? Body.GetHashCode() : 0);
                hashCode = (hashCode * 397) ^ DateTime.GetHashCode();
                return hashCode;
            }
        }
    }
}
