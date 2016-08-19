#!/usr/bin/python

#
# Builds up a release package ready to be built or distributed by NPM.  The distributable content
# is taken from the development folder to make it easier to strip out unneeded package content.
#

# Imports
import shutil, os
import fnmatch
import distutils.dir_util
import cli

#
# Gets the current root directory of the project
# 
def get_project_root():

    # Get the path to our source
    file_name = os.path.basename(__file__)
    script_root = os.path.realpath(__file__).replace(file_name, '')

    source_folder = script_root + '..'
    return source_folder


#
# Finds all files with a specific extension
#
def remove_all_files(directory, extension):

    # Delete everything in the source folders
    for root, dirnames, filenames in os.walk(directory):
        for filename in fnmatch.filter(filenames, extension):
            file_path = os.path.join(root, filename)
            os.remove(file_path)


#
# Removes all the build files so we can do a clean build
#
def clean_build_files():

    # Get our path
    source_folder = get_project_root() + '/development/src'

    remove_all_files(source_folder, '*.js')
    remove_all_files(source_folder, '*.js.map')
    remove_all_files(source_folder, '*.d.ts')

#
# Builds the Typescript project
#
def build_project():

    config_root = get_project_root() + '/development/'

    return_code, std_out, std_err = cli.run_command_line(config_root, "tsc", ['-p', 'tsconfig-ci.json'])
    if (return_code != 0):
        exit(return_code)

#
# Gets the main package folder
#
def create_package_folder():

    # Get the path to the distribution package
    root_path = os.getcwd() + '/../release'
    if os.path.exists(root_path):
        shutil.rmtree(root_path)
    distribution_folder = '/{}/package'.format(root_path)
    os.makedirs(distribution_folder)

    # Send it back with the root folder
    return os.getcwd() + '/../', distribution_folder + '/'


#
# Main entry function
#
def main():

    # Clean up our current build files
    clean_build_files()

    # Build the project
    build_project()

    # Get our folder
    root_folder, distribution_folder = create_package_folder()

    # Copy over the root content
    shutil.copyfile(root_folder + 'LICENSE', distribution_folder + 'LICENSE')
    shutil.copyfile(root_folder + 'README.md', distribution_folder + 'README.md')

    # Package content
    shutil.copyfile(root_folder + 'development/package.json', distribution_folder + 'package.json')

    # Copy over all the source files
    distutils.dir_util.copy_tree(root_folder + 'development/src/ng2-dynamic-dialog', distribution_folder)
    

#
# Main entry point
#
if __name__ == "__main__":
    main()
