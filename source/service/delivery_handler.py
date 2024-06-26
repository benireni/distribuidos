import pymongo, uuid

public_health_care_client = pymongo.MongoClient("mongodb://localhost:27017/")["public-health-care"]

stock_collection = public_health_care_client["stock"]
prescription_collection = public_health_care_client["prescription"]
patient_collection = public_health_care_client["patient"]
delivery_collection = public_health_care_client["delivery"]

def get_stock_by_region_and_medication(region, register_medication):
    return stock_collection.find_one({'region': region, 'register_medication': register_medication}, {})

def get_stock_by_medication(register_medication):
    return stock_collection.find_one({'register_medication': register_medication}, {})

def get_prescription_by_id(prescription_id):
    return prescription_collection.find_one({'id': prescription_id}, {})

def get_patient_region_by_cpf(patient_cpf):
    return patient_collection.find_one({'cpf': patient_cpf}, {})['region']

def discard_prescription(prescription_id):
    prescription_collection.update_one({'id': prescription_id}, {'$set': {'valid': False}})

def place_delivery_patient(region, patient_cpf, base_stock_id, prescription_id, quantity):
    delivery_id = str(uuid.uuid4())
    delivery = {
        'id': delivery_id,
        'type': "PACIENTE",
        'patient_cpf': patient_cpf,
        'prescription_id': prescription_id,
        'region_origin': None,
        'region_destiny': region,
        'stock_base': base_stock_id,
        'quantity': quantity
    }
    delivery_collection.insert_one(delivery)
    return delivery_id

def place_delivery_region(region_destiny, region_origin, base_stock_id, destiny_stock_id, quantity):
    delivery_id = str(uuid.uuid4())
    delivery = {
        'id': delivery_id,
        'type': "REGION",
        'patient_cpf': None,
        'prescription_id': None,
        'region_origin': region_origin,
        'region_destiny': region_destiny,
        'stock_base': base_stock_id,
        'stock_destiny': destiny_stock_id,
        'quantity': quantity
    }
    delivery_collection.insert_one(delivery)
    return delivery_id

def handle_medication_request(medication_request):
    region_patient = medication_request['region']
    register_medication = medication_request['register_medication']

    stock = get_stock_by_region_and_medication(region_patient, register_medication)

    available_quantity = stock['quantity']
    needed_quantity = medication_request['quantity']
    if stock:
        if available_quantity <= needed_quantity:
            discard_prescription(medication_request['prescription_id'])
            delivery_id = place_delivery_patient(medication_request['region'], medication_request['patient_cpf'], stock['id'], medication_request['prescription_id'], medication_request['quantity'])
            return 'Entrega separada! ID: {}'.format(delivery_id)
        
    available_region = get_stock_by_medication(register_medication)
    if available_region:
        delivery_id = place_delivery_region(medication_request['region'], available_region['region'], stock['id'], available_region['id'], medication_request['quantity'])
        discard_prescription(medication_request['prescription_id'])
        return 'Remedio indisponível, tente novamente mais tarde. Transferência agendada: ID {}'.format(delivery_id)
    else:
        return 'Remedio contido na prescription não é oferecido ou não existe na quantity adequada.'

def submit_medication_request(prescription_id):
    prescription = get_prescription_by_id(prescription_id)
    if not prescription['valid']:
        return 'Receita inválida.'

    region = get_patient_region_by_cpf(prescription['patient_cpf'])

    request = {
        'prescription_id': prescription['id'],
        'patient_cpf': prescription['patient_cpf'],
        'register_medication': prescription['register_medication'],
        'quantity': prescription['quantity'],
        'region': region
    }

    # produce to kafka

    response = handle_medication_request(request)
    print(response)

    return response

mocked_prescription = {
    'id': '982c38fe-2250-4c7c-926a-fa08f9970907',
    'crm': 123,
    'name_doctor': 'medicao',
    'patient_cpf': '51410642549',
    'quantity': 90,
    'register_medication': 'dff8e6f3-f485-43de-9d66-be8d356446ef',
    'description': "prescription daorinha pra ficar legau",
    'valid': True
}

mocked_region = 'Centrinho'

response = submit_medication_request(mocked_prescription, mocked_region)
