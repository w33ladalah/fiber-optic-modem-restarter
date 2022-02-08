# Internet Modem Restarter (Telkom Indihome)

Command line application to restart fiber optic modem. Currently only support **Telkom Indihome** modem with type **ZTE F609**. Other modem type does not supported yet.

## How to run
1. Clone this repository.
2. Change current directory to the project directory.
3. Create **.env** file and add following lines (replace the variable values with your modem credentials):

	MODEM_URL="http://192.168.1.1"\
	MODEM_USER="<MODEM_USER>"\
	MODEM_PASSWORD="<MODEM_PASSWORD>"

4. Run: *$ npm install* or *$ yarn*.
5. And, finally: *$ npm run start*.
6. Done!
