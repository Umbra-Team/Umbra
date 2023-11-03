import json

with open('image.txt', 'r') as f:
    image = f.read().strip() or 'default_image'

with open('container.template.json', 'r') as f:
    data = json.load(f)

data['containers']['express-server']['image'] = image

with open('container.json', 'w') as f:
    json.dump(data, f, indent=2)