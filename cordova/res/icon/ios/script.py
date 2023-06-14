import xml.etree.ElementTree as ET
from PIL import Image

def generate_icons(xml_file, source_icon):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    print(root.findall('platform'))

    # for platform in root.findall('platform'):
        # if platform.attrib['name'] == 'ios':
    for icon in root.findall('icon'):
        src = icon.attrib['src']
        width = int(icon.attrib['width'])
        height = int(icon.attrib['height'])
        output_filename = src.split('/')[-1]

        # Resize the source icon to the desired dimensions
        image = Image.open(source_icon)
        resized_image = image.resize((width, height), Image.ANTIALIAS)

        # Save the resized icon with the output filename
        resized_image.save(output_filename)

        print(f"Icon generated: {output_filename} {width}x{height}")

# Usage example
xml_file = "sizes.xml"
source_icon = "bron-icon.png"
generate_icons(xml_file, source_icon)
