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

    # Get the path to the distribution package
    package_path = os.getcwd() + '/../release/package/'
    destination_path = os.getcwd() + '/../release/' 
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
    shutil.move(package_path + std_out.strip(), package_path + '../')

    # Done
    print "Successfully created package file " + std_out.strip()
    

#
# Main entry point
#
if __name__ == "__main__":
    main()
