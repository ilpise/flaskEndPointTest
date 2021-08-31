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


@api_blueprint.route('/modbus/api/carico', methods=['GET'])
def carico():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    wc = client.write_coil( 521, 1, unit=UNIT )

    assert (not wc.isError())
    print(wc)
    # print(wc.bits[0])
    # logging.info( '%s logged in successfully', user.username )

    # client.close()
    ret = {"response": wc.bits[0]}
    return(jsonify(ret), 200)


@api_blueprint.route('/modbus/api/alarms', methods=['GET'])
def alarms():
    OpenplcIp = current_app.config["OPENPLC_IP"]
    ModbusPort = current_app.config["OPENPLC_MODBUS_PORT"]

    # current_app.logger.error( "ALARMS" )

    # NOTE - the default port for modbus is 502
    client = ModbusTcpClient( OpenplcIp, port=ModbusPort )
    client.connect()

    rc = client.read_coils( 440, 9, unit=UNIT )
    assert (not rc.isError())
    # current_app.logger.error( rc )
    # current_app.logger.error( rc.bits )
    # print(wc.bits[0])
    # logging.info( '%s logged in successfully', user.username )

    # client.close()
    ret = {"response": rc.bits}

    # ret = {"response": [False, False, True, False, False, False, False, False, False, False, False, False, False, False, False, False]}

    return(jsonify(ret), 200)
