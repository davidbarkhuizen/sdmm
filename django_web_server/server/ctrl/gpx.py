import sys
from fx.httpfx import success, failure, mandatory_parameters, init_routing
from gpxfx.gpxparser import parse_gpx_xml_to_domain_model
from server.models import Gpx

# exception formatting
import traceback

@mandatory_parameters(['fileName', 'xml'])
def post(request, params):

	file_name = params['fileName']
	xml = params['xml']

	# --------------------------

	if Gpx.objects.filter(xml=xml).exists() == True:
		return failure('already imported')

	gpx = None
	try:
		gpx = parse_gpx_xml_to_domain_model(xml)
	except Exception, e:
		return failure('invalid gpx')

	dbModel = Gpx()
	dbModel.xml = xml
	dbModel.file_name = file_name
	dbModel.update_from_domain_model(gpx)

	dbModel.save()

	return success('gpx created')

@mandatory_parameters(['id'])
def get(request, params):

	id = params['id']

	model = Gpx.objects.get(id=id)    
	if (model == None):
		return failure('could not find gpx with id = %s' % id)    

	data = { 'id' : id, 'file_name' : model.file_name, 'xml' : model.xml  }
	
	return success(data)

def patch(request, params):

	id_key = 'id'
	file_name_key = 'fileName'
	xml_key = 'xml'

	failed_on_missing_parameters = fail_on_missing_parameters(params, [id_key, file_name_key, xml_key])
	if failed_on_missing_parameters:
		return failed_on_missing_parameters

	id = params[id_key]
	file_name = params[file_name_key]
	xml = params[xml_key]

	try:
		gpx = parse_gpx_xml_to_domain_model(xml)
	except Exception, e:
		return failure('not a valid gpx file')

	# retrieve
	#
	dbModel = Gpx.objects.get(id=id)    
	if (dbModel == None):
		return failure('could not find gpx with id = %s' % id)    

	dbModel.xml = xml
	dbModel.file_name = file_name
	dbModel.update_from_domain_model(gpx)

	dbModel.save()

	return success('gpx updated')

init_routing(sys.modules[__name__], __name__)