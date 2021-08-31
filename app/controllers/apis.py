# Copyright 2021 Simone Corti. All rights reserved

import logging
import asyncio
from flask import Blueprint, jsonify, current_app, request
# from flask_login import current_user
# import bcrypt
# from app import user_manager
# from ..models.user_models import User
# from app import db, UserManager

from pymodbus.client.asynchronous.tcp import AsyncModbusTCPClient as ModbusClient
from pymodbus.client.asynchronous import schedulers
from pymodbus.client.sync import ModbusTcpClient

UNIT = 0x1


## Define a coroutine that takes in a future
async def myCoroutine():
    await asyncio.sleep( 1000 )
    print("My Coroutine")

## Define a coroutine that takes in a future
async def async_get_data(client):
    print('Enter async_get_data')
    print(client)
    if client is not None:
        rr = await client.read_holding_registers( 1, 8, unit=UNIT )
        # assert (not rr.isError())
        if not rr.isError():
            print( rr.registers )
            return rr.registers
    else:
        # uncomment to test concurrent requests
        # The modbus_server_machine1_1 must be stopped
        # await asyncio.sleep( 100 )
        return 'Error - check modbus server is reachable'

# When using a Flask app factory we must use a blueprint to avoid needing 'app' for '@app.route'
api_blueprint = Blueprint('api', __name__, template_folder='templates')

@api_blueprint.route('/modbus/api/testasync', methods=['GET'])
def read_modbus_async():
    new_loop, client = ModbusClient(schedulers.ASYNC_IO, port=5021)
    print ('C1')
    print(client)
    # assert(client is not None)
    results = new_loop.run_until_complete( async_get_data( client.protocol ) )
    new_loop.close()
    ret = {"sample return": results}
    return(jsonify(ret), 200)

@api_blueprint.route('/sample_api_request', methods=['GET'])
def sample_page():

    ret = {"sample return": 10}
    return(jsonify(ret), 200)


# Synchronous Client
@api_blueprint.route('/modbus/api/', methods=['GET'])
def read():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    rr = client.read_holding_registers( 1125, 1, unit=UNIT )

    assert (not rr.isError())
    print(rr)
    print(rr.registers)
    # logging.info( '%s logged in successfully', user.username )

    # client.close()
    ret = {"response": rr.registers}
    return(jsonify(ret), 200)


@api_blueprint.route('/modbus/api/eroga', methods=['POST'])
def eroga():
    print( request.get_json() )

    json_data = request.get_json()
    pef = json_data["peso_finale"]
    sog = json_data["soglia"]
    print(pef)
    print(sog)
    # payload = [0, pef, 0, sog]
    payload = [int(pef), int(sog)]

    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    # write holding registers 0 | peso_finale | 0 | soglia
    # whr = client.write_register( 1125, 1, unit=0x1 )
    rq = client.write_registers( 200, payload, unit=UNIT )
    rr = client.read_holding_registers( 200, 2, unit=UNIT )
    assert (not rq.isError())  # test that we are not an error
    assert (not rr.isError())  # test that we are not an error
    assert (rr.registers == payload)

    # write coil regster Enable Ciclo Scarico
    ecs = client.write_coil( 522, True, unit=UNIT )
    rr = client.read_coils( 522, 1, unit=UNIT )
    assert (not ecs.isError())
    assert (not rr.isError())

    # client.close()
    ret = {"response": "Ciclo Scarico Abilitato"}
    # ret = {"response": "test"}
    return(jsonify(ret), 200)


@api_blueprint.route('/modbus/api/carico', methods=['GET'])
def carico():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    wc = client.write_coil( 521, True, unit=UNIT )
    rr = client.read_coils( 521, 1, unit=UNIT )
    assert (not wc.isError())
    assert (not rr.isError())

    # print(wc.bits[0])
    # logging.info( '%s logged in successfully', user.username )

    # client.close()
    ret = {"response": rr.bits[0]}
    return(jsonify(ret), 200)

@api_blueprint.route('/modbus/api/stop_carico', methods=['GET'])
def stop_carico():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    wc = client.write_coil( 521, False, unit=UNIT )
    rr = client.read_coils( 521, 1, unit=UNIT )
    assert (not wc.isError())
    assert(not rr.isError())

    # client.close()
    ret = {"response": rr.bits[0]}
    return(jsonify(ret), 200)

@api_blueprint.route('/modbus/api/alarms', methods=['GET'])
def alarms():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # current_app.logger.error( "ALARMS" )

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    # The response is a 8 bit mask - Why?
    rc1 = client.read_coils( 440, 1, unit=UNIT )
    # 'K_ALM_TIMEOUT_FASE10',
    # 'K_ALM_TIMEOUT_FASE20',
    # 'K_ALM_TIMEOUT_FASE30',
    # 'K_ALM_TIMEOUT_FASE40',
    # 'ALM_START_SOFFIANTE_NOK',
    # 'ALM_FUNGO_SOFFIANTE',
    # 'ALM_PTC_SOFFIANTE',
    # 'ALM_TERMICA_SOFFIANTE',

    rc2 = client.read_coils( 448, 1, unit=UNIT )

    assert (not rc1.isError())
    assert (not rc2.isError())
    # current_app.logger.error( rc )
    # current_app.logger.error( rc.bits )
    # print(wc.bits[0])
    # logging.info( '%s logged in successfully', user.username )

    # client.close()
    ret = {"rc1": rc1.bits, "rc2": rc2.bits}

    return(jsonify(ret), 200)

@api_blueprint.route('/modbus/api/reset_alarms', methods=['GET'])
def reset_alarms():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # current_app.logger.error( "ALARMS" )

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    # The response is a 8 bit mask - Why?
    rq = client.write_coil( 520, True, unit=UNIT ) # reset allarmi
    assert (not rq.isError())
    wc = client.write_coil( 521, False, unit=UNIT ) # Stop carico
    assert (not wc.isError())
    ecs = client.write_coil( 522, False, unit=UNIT ) # stop scarico/eroga
    assert (not ecs.isError())
    # client.close()
    ret = {"response": "Reset cycle OK"}

    return(jsonify(ret), 200)
