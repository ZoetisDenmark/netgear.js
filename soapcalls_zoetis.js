const netgearSoapCalls = require('./soapcalls')

exports.action = {
	
	getAllConfigLAN: 'urn:NETGEAR-ROUTER:service:LANConfigSecurity:1#GetAllConfigLAN',
	setConfigLAN: 'urn:NETGEAR-ROUTER:service:LANConfigSecurity:1#SetConfigLAN',
	getConfigMACReservation: 'urn:NETGEAR-ROUTER:service:LANConfigSecurity:1#GetConfigMACReservation',
	setConfigMACReservation: 'urn:NETGEAR-ROUTER:service:LANConfigSecurity:1#SetConfigMACReservation',

	setIPInterfaceInfo: 'urn:NETGEAR-ROUTER:service:WANIPConnection:1#SetIPInterfaceInfo',

	getWLANGetInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#GetInfo',
	getWLANGet5GInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Get5GInfo',
	setWLANWPAPSKByPassphrase: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#SetWLANWPAPSKByPassphrase',
	set5GWLANWPAPSKByPassphrase: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Set5GWLANWPAPSKByPassphrase',
	//setWLANSetInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#SetInfo',
	//setWLANSet5GInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Set5GInfo',

	getGuestAccessNetworkInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#GetGuestAccessNetworkInfo',
	get5GGuestAccessNetworkInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Get5GGuestAccessNetworkInfo',
	setAllGuestAccessNetworkInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#SetAllGuestAccessNetworkInfo',
	set5GAllGuestAccessNetworkInfo: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Set5GAllGuestAccessNetworkInfo',

	getWireless3Info: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#GetWireless3Info',
	get5GWireless3Info: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Get5GWireless3Info',
	setWireless3Enabled: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#SetWireless3Enabled',
	set5GWireless3Enabled: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Set5GWireless3Enabled',

	getGuestPortal: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#GetGuestPortal',
	get5GGuestPortal: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Get5GGuestPortal',
	setGuestPortal: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#SetGuestPortal',
	set5GGuestPortal: 'urn:NETGEAR-ROUTER:service:WLANConfiguration:1#Set5GGuestPortal',

	getVLANProfileConfiguration: 'urn:NETGEAR-ROUTER:service:DeviceConfig:1#GetVLANProfileConfiguration',

	getSatelliteLANStatus: 'urn:NETGEAR-ROUTER:service:DeviceInfo:1#GetSatelliteLANStatus',
	getAllSatellites: 'urn:NETGEAR-ROUTER:service:DeviceInfo:1#GetAllSatellites',
	getLLDPInfo: 'urn:NETGEAR-ROUTER:service:DeviceInfo:1#GetLLDPInfo',

	getRemoteAccess: 'urn:NETGEAR-ROUTER:service:DeviceConfig:1#GetRemoteAccess',
	setRemoteAccess: 'urn:NETGEAR-ROUTER:service:DeviceConfig:1#SetRemoteAccess',
	resetPasswordToDefault: 'urn:NETGEAR-ROUTER:service:DeviceConfig:1#ResetPasswordToDefault',

}

const soapEnvelope = (sessionId, soapBody) => {
	const soapRequest = `<!--?xml version="1.0" encoding= "UTF-8" ?-->
	<v:Envelope
	xmlns:v="http://schemas.xmlsoap.org/soap/envelope/">
	<v:Header>
		<SessionID>${sessionId}</SessionID>
	</v:Header>
	${soapBody}
	</v:Envelope>`;
	return soapRequest;
};


exports.getConfigLAN = (sessionId) => {
	const soapBody = `<v:Body>
		<n0:GetConfigLAN xmlns:n0="urn:NETGEAR-ROUTER:service:LANConfigSecurity:1" />
	</v:Body>`;
	return netgearSoapCalls.soapEnvelope(sessionId, soapBody);
};

exports.getAllConfigLAN = (sessionId) => {
	const soapBody = `<v:Body>
		<n0:GetAllConfigLAN xmlns:n0="urn:NETGEAR-ROUTER:service:LANConfigSecurity:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.setConfigLAN = (sessionId, p ) => {
	const d = {
				NewLANID : 'lan1',
				NewLANEnabled : '1',
				NewLANIP : '192.168.234.1',
				NewLANSubnet : '255.255.255.0',
				NewDHCPEnabled : '1',
				NewStartIP : '192.168.234.150',
				NewEndIP : '192.168.234.179',
				NewVLANProfile : '1'
			}

	const v = { ...d, ...p };


	const soapBody =
		`<v:Body>
			<M1:SetConfigLAN xmlns:M1="urn:NETGEAR-ROUTER:service:LANConfigSecurity:1">
               <NewLANID>${v.NewLANID}</NewLANID>
               <NewLANEnabled>${v.NewLANEnabled}</NewLANEnabled>
                <NewLANIP>${v.NewLANIP}</NewLANIP>
                <NewLANSubne>${v.NewLANSubnet}</NewLANSubne>				// must be 'NewLANSubne' - not 'NewLANSubnet'
                <NewDHCPEnabled>${v.NewDHCPEnabled}</NewDHCPEnabled>
                <NewStartIP>${v.NewStartIP}</NewStartIP>
                <NewEndIP>${v.NewEndIP}</NewEndIP>
                <NewVLANProfile>${v.NewVLANProfile}</NewVLANProfile>
			</M1:SetConfigLAN>
		</v:Body>`;


	return soapEnvelope(sessionId, soapBody);
};

exports.getConfigMACReservation = (sessionId) => {
	const soapBody = `<v:Body>
		<n0:GetConfigMACReservation xmlns:n0="urn:NETGEAR-ROUTER:service:LANConfigSecurity:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.setConfigMACReservation = (sessionId) => {
	const soapBody = `<v:Body>
		<n0:SetConfigMACReservation xmlns:n0="urn:NETGEAR-ROUTER:service:LANConfigSecurity:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.setIPInterfaceInfo = (sessionId, p ) => {
	const d = {
				NewAddressingType : 'DHCP',
				NewExternalIPAddress : '',
				NewSubnetMask : '',
				NewDefaultGateway : '',
				NewPrimaryDNS : '',
				NewSecondaryDNS : ''
			}

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:SetIPInterfaceInfo xmlns:M1="urn:NETGEAR-ROUTER:service:WANIPConnection:1">
				<NewAddressingType>${v.NewAddressingType}</NewAddressingType>
				<NewExternalIPAddress>${v.NewExternalIPAddress}</NewExternalIPAddress>
				<NewSubnetMask>${v.NewSubnetMask}</NewSubnetMask>
				<NewDefaultGateway>${v.NewDefaultGateway}</NewDefaultGateway>
				<NewPrimaryDNS>${v.NewPrimaryDNS}</NewPrimaryDNS>
				<NewSecondaryDNS>${v.NewSecondaryDNS}</NewSecondaryDNS>
			</M1:SetIPInterfaceInfo>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};

exports.getWLANGetInfo = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetInfo xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getWLANGet5GInfo = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:Get5GInfo xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getGuestAccessNetworkInfo = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetGuestAccessNetworkInfo xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.get5GGuestAccessNetworkInfo = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:Get5GGuestAccessNetworkInfo xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getWireless3Info = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetWireless3Info xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.get5GWireless3Info = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:Get5GWireless3Info xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getGuestPortal = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetGuestPortal xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.get5GGuestPortal = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:Get5GGuestPortal xmlns:n0="urn:NETGEAR-ROUTER:service:WLANConfiguration:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getAllSatellites = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetAllSatellites xmlns:n0="urn:NETGEAR-ROUTER:service:DeviceInfo:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getRemoteAccess = (sessionId) =>
{
	const soapBody = `<v:Body>
		<n0:GetRemoteAccess xmlns:n0="urn:NETGEAR-ROUTER:service:DeviceConfig:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};

exports.getVLANProfileConfiguration = (sessionId) => {
	const soapBody = `<v:Body>
		<n0:GetVLANProfileConfiguration xmlns:n0="urn:NETGEAR-ROUTER:service:DeviceConfig:1" />
	</v:Body>`;
	return soapEnvelope(sessionId, soapBody);
};


exports.setWLANWPAPSKByPassphrase = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:SetWLANWPAPSKByPassphrase xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewRegion>${v.NewRegion}</NewRegion>
				<NewChannel>${v.NewChannel}</NewChannel>
				<NewWirelessMode>${v.NewWirelessMode}</NewWirelessMode>
				<NewWPAEncryptionModes>${v.NewWPAEncryptionModes}</NewWPAEncryptionModes>
				<NewWPAPassphrase>${v.NewWPAPassphrase}</NewWPAPassphrase>
			</M1:SetWLANWPAPSKByPassphrase>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};


exports.set5GWLANWPAPSKByPassphrase = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:Set5GWLANWPAPSKByPassphrase xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewRegion>${v.NewRegion}</NewRegion>
				<NewChannel>${v.NewChannel}</NewChannel>
				<NewWirelessMode>${v.NewWirelessMode}</NewWirelessMode>
				<NewWPAEncryptionModes>${v.NewWPAEncryptionModes}</NewWPAEncryptionModes>
				<NewWPAPassphrase>${v.NewWPAPassphrase}</NewWPAPassphrase>
			</M1:Set5GWLANWPAPSKByPassphrase>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};



exports.setAllGuestAccessEnabled = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:SetAllGuestAccessEnabled xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewGuestAccessEnabled>${v.NewGuestAccessEnabled}</NewGuestAccessEnabled>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityMode>${v.NewSecurityMode}</NewSecurityMode>
				<SeparateSSIDEnabled>${v.SeparateSSIDEnabled}</SeparateSSIDEnabled>
				<NewKey1>${v.NewKey1}</NewKey1>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<NewAllowAccessLan>${v.NewAllowAccessLan}</NewAllowAccessLan>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewEnterpriseWPAMode>${v.NewEnterpriseWPAMode}</NewEnterpriseWPAMode>
				<NewRadiusServerAddress>${v.NewRadiusServerAddress}</NewRadiusServerAddress>
				<NewRadiusServerPort>${v.NewRadiusServerPort}</NewRadiusServerPort>
			</M1:SetAllGuestAccessEnabled>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};



exports.set5GAllGuestAccessEnabled = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:Set5GAllGuestAccessEnabled xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewGuestAccessEnabled>${v.NewGuestAccessEnabled}</NewGuestAccessEnabled>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityMode>${v.NewSecurityMode}</NewSecurityMode>
				<SeparateSSIDEnabled>${v.SeparateSSIDEnabled}</SeparateSSIDEnabled>
				<NewKey1>${v.NewKey1}</NewKey1>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<NewAllowAccessLan>${v.NewAllowAccessLan}</NewAllowAccessLan>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewEnterpriseWPAMode>${v.NewEnterpriseWPAMode}</NewEnterpriseWPAMode>
				<NewRadiusServerAddress>${v.NewRadiusServerAddress}</NewRadiusServerAddress>
				<NewRadiusServerPort>${v.NewRadiusServerPort}</NewRadiusServerPort>
			</M1:Set5GAllGuestAccessEnabled>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};


exports.setWireless3Enabled = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:SetWireless3Enabled xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewEnable>${v.NewEnable}</NewEnable>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityMode>${v.NewSecurityMode}</NewSecurityMode>
				<SeparateSSIDEnabled>${v.SeparateSSIDEnabled}</SeparateSSIDEnabled>
				<NewKey1>${v.NewKey1}</NewKey1>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewEnterpriseWPAMode>${v.NewEnterpriseWPAMode}</NewEnterpriseWPAMode>
				<NewRadiusServerAddress>${v.NewRadiusServerAddress}</NewRadiusServerAddress>
				<NewRadiusServerPort>${v.NewRadiusServerPort}</NewRadiusServerPort>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<NewAllowAccessLan>${v.NewAllowAccessLan}</NewAllowAccessLan>
			</M1:SetWireless3Enabled>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};


exports.set5GWireless3Enabled = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:Set5GWireless3Enabled xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewEnable>${v.NewEnable}</NewEnable>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityMode>${v.NewSecurityMode}</NewSecurityMode>
				<SeparateSSIDEnabled>${v.SeparateSSIDEnabled}</SeparateSSIDEnabled>
				<NewKey1>${v.NewKey1}</NewKey1>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewEnterpriseWPAMode>${v.NewEnterpriseWPAMode}</NewEnterpriseWPAMode>
				<NewRadiusServerAddress>${v.NewRadiusServerAddress}</NewRadiusServerAddress>
				<NewRadiusServerPort>${v.NewRadiusServerPort}</NewRadiusServerPort>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<NewAllowAccessLan>${v.NewAllowAccessLan}</NewAllowAccessLan>
			</M1:Set5GWireless3Enabled>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};


exports.setGuestPortal = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:SetGuestPortal xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewEnable>${v.NewEnable}</NewEnable>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityOption>${v.NewSecurityOption}</NewSecurityOption>
				<NewKey1>${v.NewKey1}</NewKey1>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewAuthMode>${v.NewAuthMode}</NewAuthMode>
				<NewAuthOption>${v.NewAuthOption}</NewAuthOption>
				<NewAuthPassword>${v.NewAuthPassword}</NewAuthPassword>
				<NewExpiration>${v.NewExpiration}</NewExpiration>
			</M1:SetGuestPortal>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};


exports.set5GGuestPortal = (sessionId, p ) => {
	const d = {	};

	const v = { ...d, ...p };

	const soapBody =
		`<v:Body>
			<M1:Set5GGuestPortal xmlns:M1="urn:NETGEAR-ROUTER:service:WLANConfiguration:1">
				<NewEnable>${v.NewEnable}</NewEnable>
				<NewSSID>${v.NewSSID}</NewSSID>
				<NewSecurityOption>${v.NewSecurityOption}</NewSecurityOption>
				<NewKey1>${v.NewKey1}</NewKey1>
				<NewSSIDBroadcast>${v.NewSSIDBroadcast}</NewSSIDBroadcast>
				<VlanProfile>${v.VlanProfile}</VlanProfile>
				<VlanEnable>${v.VlanEnable}</VlanEnable>
				<NewAuthMode>${v.NewAuthMode}</NewAuthMode>
				<NewAuthOption>${v.NewAuthOption}</NewAuthOption>
				<NewAuthPassword>${v.NewAuthPassword}</NewAuthPassword>
				<NewExpiration>${v.NewExpiration}</NewExpiration>
			</M1:Set5GGuestPortal>
		</v:Body>`;

	return soapEnvelope(sessionId, soapBody);
};