from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="weaving",
    version="1.0.0",
    description="Generic Weaving Management Module for ERPNext",
    long_description="A multi-site compatible Frappe/ERPNext app for managing Weaving Contracts, BOM Items, Looms, Shifts and Loom Production.",
    author="Open Source",
    author_email="",
    url="",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
    python_requires=">=3.10",
)
