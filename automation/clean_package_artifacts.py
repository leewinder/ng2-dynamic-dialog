#!/usr/bin/python

#
# Deletes any artifacts generated from the package scripts
#

# Imports
import shutil, os
import fnmatch
import distutils.dir_util
import cli


#
# Main entry function
#
def main():

    # Get the path to the distribution package
    root_path = cli.get_project_root() + '/release'
    if os.path.exists(root_path):
        shutil.rmtree(root_path)    


#
# Main entry point
#
if __name__ == "__main__":
    main()
