from tethys_sdk.base import TethysAppBase, url_map_maker


class Hydroviewer(TethysAppBase):
    """
    Tethys app class for HydroViewer.
    """

    name = 'HydroViewer'
    index = 'hydroviewer:home'
    icon = 'hydroviewer/images/icon.gif'
    package = 'hydroviewer'
    root_url = 'hydroviewer'
    color = '#425e17'
    description = ''
    tags = '"Hydrology"'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='hydroviewer',
                           controller='hydroviewer.controllers.home'),
                    UrlMap(name='ecmwf',
                           url='ecmwf-rapid',
                           controller='hydroviewer.controllers.ecmwf'),
                    UrlMap(name='lis',
                           url='lis-rapid',
                           controller='hydroviewer.controllers.lis'),
                    UrlMap(name='get-available-dates',
                           url='ecmwf-rapid/get-available-dates',
                           controller='hydroviewer.controllers.get_available_dates'),
                    UrlMap(name='get-time-series',
                           url='ecmwf-rapid/get-time-series',
                           controller='hydroviewer.controllers.get_time_series'),
        )

        return url_maps