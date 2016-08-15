#!/usr/bin/python

#
# Builds up a release package ready to be built or distributed by NPM.  The distributable content
# is taken from the development folder to make it easier to strip out unneeded package content.
#

# Imports
import shutil, os
import distutils.dir_util


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
