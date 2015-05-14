from point import Point

class WayPoint(Point):

    def __init__(self, id, name, lat, lon, ele, time):
        self.id = id
        self.name = name
        super(WayPoint,self).__init__(lat, lon, ele, time)

    def to_dict(self):
    	return {
			'id' : self.id,
			'name' : self.name,

			'lat' : self.lat,
			'lon' : self.lon,
			'ele' :  self.ele,
			
			'time' : self.time.isoformat()
		}
