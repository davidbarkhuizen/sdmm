var Event = Object.freeze({

	DATA_MODEL_CHANGED : guid(),

	DEBUG_ERROR : guid(),

	GPX_FILE_IMPORT_SUCCEEDED : guid(),
	GPX_FILE_IMPORT_PROCESS_COMPLETED : guid(),

	GPX_LOADED : guid(),
	GPXS_UNLOADED : guid(),

	TRACK_LOADED : guid(),
	TRACKS_UNLOADED : guid(),

	TRACK_SELECTED : guid(),
	MAP_SELECTION_BEGUN : guid(),

	WAYPOINTS_LOADED : guid(),
	WAYPOINTS_UNLOADED : guid(),

	WAYPOINT_EDITED : guid(),
	WAYPOINT_DELETED : guid(),

	GPX_EDITED : guid(),
});

var Command = Object.freeze({

	COPY_WAYPOINTS_TO_GPX : guid(),
	
	// GPX
	//
	LOAD_GPX : guid(),
	UNLOAD_GPX : guid(),
	// EDIT
	UPDATE_GPX_FILENAME : guid(),
	UPDATE_GPX_NAME : guid(),
	UPDATE_GPX_DESC : guid(),

	UPDATE_WAYPOINT_NAME : guid(),

	LOAD_WAYPOINTS : guid(),

	UNLOAD_TRACK : guid(),
	DELETE_TRKSEG_SECTION : guid(),

	COPY_TRACK_TO_GPX : guid(),

	// ---------------------------------------------------------

	EXPORT_GPX : guid(),	
	EXPORT_TRACKS : guid(),
	EXPORT_WAYPOINTS : guid(),

	EXPORT_MAP : guid(), // TODO how do these differ ?
	EXPORT_CANVAS : guid(),

	GOTO_VIEW : guid(),
});