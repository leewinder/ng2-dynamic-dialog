#!/usr/bin/python

#
# Creates a local NPM package for testing using the output generated 
# from 'prepare_distribution_package.py'
#

# Imports
import shutil, os
import glob
import cli

#
# Gets the main package folder
#
def get_package_folder():

    project_path = cli.get_project_root()

    # Get the path to the distribution package
    package_path = project_path + '/release/package/'
    destination_path = project_path + '/release/' 
    return package_path, destination_path


#
# Removes any existing packages
#
def remove_existing_packages(destination_path):
    
    # Make sure any local packages are removed
    for package_file in glob.glob(destination_path + "*.tgz"):
        os.remove(package_file)


#
# Main entry function
#
def main():

    # Get our folder and remove existing packages
    package_path, destination_path = get_package_folder()
    remove_existing_packages(destination_path)

    # Build our package
    return_code, std_out, std_err = cli.run_command_line(package_path, "npm", ["pack"])
    if (return_code != 0):
        exit(return_code)
        
    # Move the file we just created
    package_made = std_out.strip()
    shutil.move(package_path + package_made, package_path + '../ng2-dynamic-dialog.tgz')

    # Done
    print "Successfully created package file " + package_made
    

#
# Main entry point
#
if __name__ == "__main__":
    main()
