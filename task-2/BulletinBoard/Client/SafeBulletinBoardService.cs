using System;
using System.Collections.Generic;
using BulletinBoardServiceContract;

namespace Client
{
    public class SafeBulletinBoardService : IBulletinBoardService
    {
        private readonly IBulletinBoardService _bulletinBoardService;
        private readonly Action<string> _errorCallback;
        private bool _throwed;

        public SafeBulletinBoardService(IBulletinBoardService bulletinBoardService, Action<string> errorCallback)
        {
            _bulletinBoardService = bulletinBoardService;
            _errorCallback = s =>
            {
                if (!_throwed)
                {
                    errorCallback(s);
                }

                _throwed = true;
            };
        }

        public string Ping()
        {
            try
            {
                return _bulletinBoardService.Ping();
            }
            catch (Exception ex)
            {
                _errorCallback(ex.Message);
                return null;
            }
        }

        public void Publish(Announcement announcement)
        {
            try
            {
                _bulletinBoardService.Publish(announcement);
            }
            catch (Exception ex)
            {
                _errorCallback(ex.Message);
            }
        }

        public List<Announcement> GetAnnouncements()
        {
            try
            {
                return _bulletinBoardService.GetAnnouncements();
            }
            catch (Exception ex)
            {
                _errorCallback(ex.Message);
                return null;
            }
        }
    }
}