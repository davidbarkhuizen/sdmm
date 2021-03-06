import logging

from ftplib import FTP
import os

class FtpClient(object):

	def __init__(self, host, port, user, pwd, ac = None):
		
		self.host = host
		self.port = port
		self.user = user
		self.pwd = pwd
		self.ac = ac

		self.ftp = FTP()
		self.ftp.connect(self.host, int(self.port))
		logging.info('{0} {1} {2}'.format(type(self.user), type(self.pwd), type(self.ac))
		self.ftp.login(self.user, self.pwd, self.ac)

	def __enter__(self):
		return self

	def __exit__(self, type, value, traceback):
		if self.ftp:
			self.close()

	def create_folder_path(self, path):

		path = path.replace('\\', '/')
		while path.find('//') != -1:
			path = path.replace('//', '/')

		path_components = path.split('/')[:-1]

		for i in range(len(path_components)):
			
			sub_folder = '/'.join(path_components[:i]) 
			to_create = '/' + '/'.join(path_components[:i+1])
			tail = path_components[i]
			
			try:
				self.ftp.cwd(to_create)
			except Exception:
				logging.info('folder @ ' + to_create + ' DNE!')
				logging.info('creating ' + tail)
				self.ftp.cwd('/' + sub_folder)
				self.ftp.mkd(tail)
				logging.info('mkdir ' + tail)

	# def upload_text_file(self, source_path, dest_path, ignore_if_same_size = True):

	# 	print('upload text from {0} to {1}'.format(source_path, dest_path))

	# 	self.create_folder_path(dest_path)

	# 	source_size = os.path.getsize(source_path)
	# 	try:
	# 		dest_file_size = self.ftp.size(dest_path)
	# 	except:
	# 		dest_file_size = 0

	# 	if ((source_size == dest_file_size) and (ignore_if_same_size == True)):
	# 		print(source_path + ' - unchanged, ignoring')
	# 		return

	# 	with open(source_path, 'rb') as ftpup:
	# 	    resp = self.ftp.storbinary("STOR " + '/' + dest_path, ftpup)
	# 	    self.ftp.close()

	def upload_bin_file(self, source_path, dest_path, ignore_if_same_size = True):

		logging.info('source {0} dest {1}'.format(source_path, dest_path))

		self.create_folder_path(dest_path)

		source_file_size = os.path.getsize(source_path)

		try:
			dest_file_size = self.ftp.size('/' + dest_path)
		except Exception as e:
			logging.info('does not exist')
			dest_file_size = 0

		if source_file_size == dest_file_size:
			if ignore_if_same_size: 
				logging.info(dest_path + ' - unchanged in size, ignoring')
				return
			
		with open(source_path, 'rb') as source_bin_file:
			resp = self.ftp.storbinary("STOR " + '/' + dest_path, source_bin_file, 1024)
			logging.info(dest_path + ' uploaded')

	def close(self):
		if self.ftp:
			try:
				self.ftp.quit() # polite
			except:
				self.ftp.close() # unilateral