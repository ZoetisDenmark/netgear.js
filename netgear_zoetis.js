'use strict';

const http = require('http');
const https = require('https');
const parseXml = require('xml-js');
const Queue = require('smart-request-balancer');
const util = require('util');
const dns = require('dns');
const dgram = require('dgram');
const os = require('os');
//const soap = require('./soapcalls_zoetis');
const soap = require('./soapcalls');
const soapZoetis = require('./soapcalls_zoetis');

const setTimeoutPromise = util.promisify(setTimeout);
const dnsLookupPromise = util.promisify(dns.lookup);

const NetgearRouter = require('./netgear');

const regexResponseCode = /<ResponseCode>(.*)<\/ResponseCode>/;
const regexAttachedDevices = /<NewAttachDevice>(.*)<\/NewAttachDevice>/s;
const regexAllowedDevices = /<NewAllowDeviceList>(.*)<\/NewAllowDeviceList>/s;
const regexNewTodayUpload = /<NewTodayUpload>(.*)<\/NewTodayUpload>/;
const regexNewTodayDownload = /<NewTodayDownload>(.*)<\/NewTodayDownload>/;
const regexNewMonthUpload = /<NewMonthUpload>(.*)<\/NewMonthUpload>/;
const regexNewMonthDownload = /<NewMonthDownload>(.*)<\/NewMonthDownload>/;
const regexCurrentVersion = /<CurrentVersion>(.*)<\/CurrentVersion>/;
const regexNewVersion = /<NewVersion>(.*)<\/NewVersion>/;
const regexReleaseNote = /<ReleaseNote>(.*)<\/ReleaseNote>/s;
const regexNewUplinkBandwidth = /<NewUplinkBandwidth>(.*)<\/NewUplinkBandwidth>/;
const regexNewDownlinkBandwidth = /<NewDownlinkBandwidth>(.*)<\/NewDownlinkBandwidth>/;
const regexCurrentDeviceBandwidth = /<NewCurrentDeviceBandwidth>(.*)<\/NewCurrentDeviceBandwidth>/;
const regexCurrentDeviceUpBandwidth = /<NewCurrentDeviceUpBandwidth>(.*)<\/NewCurrentDeviceUpBandwidth>/;
const regexCurrentDeviceDownBandwidth = /<NewCurrentDeviceDownBandwidth>(.*)<\/NewCurrentDeviceDownBandwidth>/;
const regexNewSettingMethod = /<NewSettingMethod>(.*)<\/NewSettingMethod>/;
const regexUplinkBandwidth = /<NewOOKLAUplinkBandwidth>(.*)<\/NewOOKLAUplinkBandwidth>/;
const regexDownlinkBandwidth = /<NewOOKLADownlinkBandwidth>(.*)<\/NewOOKLADownlinkBandwidth>/;
const regexAveragePing = /<AveragePing>(.*)<\/AveragePing>/;
const regexParentalControl = /<ParentalControl>(.*)<\/ParentalControl>/;
const regexNewQoSEnableStatus = /<NewQoSEnableStatus>(.*)<\/NewQoSEnableStatus>/;
const regexNewSmartConnectEnable = /<NewSmartConnectEnable>(.*)<\/NewSmartConnectEnable>/;
const regexNewBlockDeviceEnable = /<NewBlockDeviceEnable>(.*)<\/NewBlockDeviceEnable>/;
const regexNewTrafficMeterEnable = /<NewTrafficMeterEnable>(.*)<\/NewTrafficMeterEnable>/;
const regexNewControlOption = /<NewControlOption>(.*)<\/NewControlOption>/;
const regexNewMonthlyLimit = /<NewMonthlyLimit>(.*)<\/NewMonthlyLimit>/;
const regexRestartHour = /<RestartHour>(.*)<\/RestartHour>/;
const regexRestartMinute = /<RestartMinute>(.*)<\/RestartMinute>/;
const regexRestartDay = /<RestartDay>(.*)<\/RestartDay>/;
const regexNewAvailableChannel = /<NewAvailableChannel>(.*)<\/NewAvailableChannel>/;
const regexNewChannel = /<NewChannel>(.*)<\/NewChannel>/;
const regexNew5GChannel = /<New5GChannel>(.*)<\/New5GChannel>/;
const regexNew5G1Channel = /<New5G1Channel>(.*)<\/New5G1Channel>/;
const regexNewLogDetails = /<NewLogDetails>(.*)<\/NewLogDetails>/s;
const regexSysUpTime = /<SysUpTime>(.*)<\/SysUpTime>/;
const regexNewEthernetLinkStatus = /<NewEthernetLinkStatus>(.*)<\/NewEthernetLinkStatus>/;

const defaultHost = 'routerlogin.net';
const defaultUser = 'admin';
const defaultPassword = 'password';
const defaultSessionId = 'A7D88AE69687E58D9A00';	

class ZoetisNetgearRouter extends NetgearRouter {

	constructor(opts, username, host, port) {
		super(opts, username, host, port)
	}

		async getAllConfigLAN() {
			try {
				const message = soapZoetis.getAllConfigLAN(this.sessionId);
				const result = await super._queueMessage(soapZoetis.action.getAllConfigLAN, message);

			const parseOptions = {
				compact: true, nativeType: true, ignoreDeclaration: true, ignoreAttributes: true, spaces: 2,
			};

			const rawJson = parseXml.xml2js(result.body, parseOptions);
			const LANInfo = {};

			var entries = rawJson['v:Envelope']['v:Body']['m:GetAllConfigLANResponse']['CurrentLANInfo']['LANInfo'];

			entries = Array.isArray(entries) ? entries : [ entries ];

			for (var e of entries)
			{
				var lan = {};

				Object.keys(e).forEach((property) =>
					{
						if (Object.prototype.hasOwnProperty.call(e, property))
						{
							lan[property] = e[property]._text;
						}
					}
				);

				LANInfo[lan.NewLANID] = lan;
			}

				return Promise.resolve(LANInfo);
			} catch (error) {
				return Promise.reject(error);
			}
		}


		async setConfigLAN(p) {
			try {
				await this._configurationStarted();
				const message = soapZoetis.setConfigLAN(this.sessionId,p);
				const result = await this._queueMessage(soapZoetis.action.setConfigLAN, message);

				await this._configurationFinished()
					.catch(() => {
						console.log(`finished with warning`);
					});
				var resp = regexResponseCode.exec(result.body)[1] === '000';
				return Promise.resolve(resp);
			} catch (error) {
				return Promise.reject(error);
			}
		}


		async getConfigMACReservation() {
			try
			{
				const message = soapZoetis.getConfigMACReservation(this.sessionId);
				const result = await this._queueMessage(soapZoetis.action.getConfigMACReservation, message);

				return Promise.resolve(this.responseObject(result.body));
			}
			catch (error) {
				return Promise.reject(error);
			}
		}

		async setIPInterfaceInfo(p) {
			try {
				await this._configurationStarted();
				const message = soapZoetis.setIPInterfaceInfo(this.sessionId,p);
				const result = await this._queueMessage(soapZoetis.action.setIPInterfaceInfo, message);

				await this._configurationFinished()
					.catch(() => {
						console.log(`finished with warning`);
					});

				var resp = regexResponseCode.exec(result.body)[1] === '000';
				return Promise.resolve(resp);
			} catch (error) {
				return Promise.reject(error);
			}
		}

		async getWLANGetInfo()
		{
			try
			{
				const message = soapZoetis.getWLANGetInfo(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getWLANGetInfo, message);

				return Promise.resolve(this.responseObject(result.body));
			}
			catch (error) {
				return Promise.reject(error);
			}
		}

		async getWLANGet5GInfo()
		{
			try
			{
				const message = soapZoetis.getWLANGet5GInfo(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getWLANGet5GInfo, message);

				return Promise.resolve(this.responseObject(result.body));
			}
			catch (error) {
				return Promise.reject(error);
			}
		}

		async getGuestAccessNetworkInfo()
		{
			try
			{
				const message = soapZoetis.getGuestAccessNetworkInfo(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getGuestAccessNetworkInfo, message);

				return Promise.resolve(this.responseObject(result.body));
			}
			catch (error) {
				return Promise.reject(error);
			}
		}


		async get5GGuestAccessNetworkInfo()
		{
			try
			{
				const message = soapZoetis.get5GGuestAccessNetworkInfo(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.get5GGuestAccessNetworkInfo, message);

				return Promise.resolve(this.responseObject(result.body));
			}
			catch (error) {
				return Promise.reject(error);
			}
		}

		async getWireless3Info()
		{
			try
			{
				const message = soapZoetis.getWireless3Info(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getWireless3Info, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}

		async get5GWireless3Info()
		{
			try
			{
				const message = soapZoetis.get5GWireless3Info(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.get5GWireless3Info, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}

		async getGuestPortal()
		{
			try
			{
				const message = soapZoetis.getGuestPortal(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getGuestPortal, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}

		async get5GGuestPortal()
		{
			try
			{
				const message = soapZoetis.get5GGuestPortal(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.get5GGuestPortal, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}


		async getAllSatellites()
		{
			try
			{
				const message = soapZoetis.getAllSatellites(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getAllSatellites, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}

		async getRemoteAccess()
		{
			try
			{
				const message = soapZoetis.getRemoteAccess(this.sessionId);
				var result = await this._queueMessage(soapZoetis.action.getRemoteAccess, message);

				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}


		async api_get(apicall,_apicall='')
		{
			if (_apicall === '')
				_apicall = apicall;

			try
			{
				if (apicall in soapZoetis.action)
				{
					const message = soapZoetis[_apicall](this.sessionId);
					var result = await this._queueMessage(soapZoetis.action[apicall], message);
				}
				else
				{
					const message = soap[_apicall](this.sessionId);
					var result = await this._queueMessage(soap.action[apicall], message);
				}
				
				return Promise.resolve(this.responseObject(result.body));
			} catch (error) {
				return Promise.reject(error);
			}
		}

	async responseObject(body)
	{
		const parseOptions = {
			compact: true, nativeType: true, ignoreDeclaration: true, ignoreAttributes: true, spaces: 2,
		};

		const rawJson = parseXml.xml2js(body, parseOptions);
		const obj = {};

		// we are copying the essential data out of the XML oriented rawJson object and storing it in a less complex object
		//
		// this logic is fairly specific to the netgear API response data structure, and allows for an array response
		//
		Object.keys(rawJson['v:Envelope']['v:Body']).forEach((property) =>
			{
				if (Object.prototype.hasOwnProperty.call(rawJson['v:Envelope']['v:Body'], property))
				{
					if (typeof rawJson['v:Envelope']['v:Body'][property] != 'object')
						obj[property] = rawJson['v:Envelope']['v:Body'][property];
					else if (property == 'ResponseCode')
						obj[property] = rawJson['v:Envelope']['v:Body'][property]['_text'];
					else
					{
						Object.keys(rawJson['v:Envelope']['v:Body'][property]).forEach((i_property) =>
							{
								if ('_text' in rawJson['v:Envelope']['v:Body'][property][i_property])
									obj[i_property] = rawJson['v:Envelope']['v:Body'][property][i_property]._text;
								else
								{
									if (Array.isArray(rawJson['v:Envelope']['v:Body'][property][i_property]))
									{
										obj[i_property] = [];

										for (var i in rawJson['v:Envelope']['v:Body'][property][i_property])
										{
											obj[i_property][i] = {};
											Object.keys(rawJson['v:Envelope']['v:Body'][property][i_property][i]).forEach((j_property) =>
											{
												obj[i_property][i][j_property] = rawJson['v:Envelope']['v:Body'][property][i_property][i][j_property]._text;
											});
										}
									}
									else
									{
										obj[i_property] = {};
										
										Object.keys(rawJson['v:Envelope']['v:Body'][property][i_property]).forEach((j_property) =>
										{
											if ('_text' in rawJson['v:Envelope']['v:Body'][property][i_property][j_property])
												obj[i_property][j_property] = rawJson['v:Envelope']['v:Body'][property][i_property][j_property]._text;
											else
											{
												if (Array.isArray(rawJson['v:Envelope']['v:Body'][property][i_property][j_property]))
												{
													obj[i_property][j_property] = [];

													for (var i in rawJson['v:Envelope']['v:Body'][property][i_property][j_property])
													{
														obj[i_property][j_property][i] = {};
														Object.keys(rawJson['v:Envelope']['v:Body'][property][i_property][j_property][i]).forEach((k_property) =>
														{
															obj[i_property][j_property][i][k_property] = rawJson['v:Envelope']['v:Body'][property][i_property][j_property][i][k_property]._text;
														});
													}
												}
												else
												{
													obj[i_property][j_property] = {};

													Object.keys(rawJson['v:Envelope']['v:Body'][property][i_property][j_property]).forEach((k_property) =>
													{
														obj[i_property][j_property][k_property] = rawJson['v:Envelope']['v:Body'][property][i_property][j_property][k_property]._text;
													});
												}
											}
										});
									}
								}
							}
						);
					}
				}
			}
		);

		return (obj);
	}

	async _makeHttpsPageRequest(options, postData, timeout=null, pw=null) {

		try
		{
			const try_pw = pw || this.password;

			const headers = {
				'cache-control': 'no-cache',
				'user-agent': 'node-netgearjs',
				'content-type': 'application/x-www-form-urlencoded',
				'content-length': Buffer.byteLength(postData),
				'authorization': `Basic ${Buffer.from(`${this.username}:${try_pw}`).toString('base64')}`,
				connection: 'Keep-Alive',
			};

			if (this.cookie)
			{
				headers.cookie = this.cookie;
			}

			const _options =
			{
				...{
					hostname: this.host,
					port: this.port,
					path: '/',
					rejectUnauthorized: false,		// allows self-signed cert...
					headers,
					method: postData ? 'POST' : 'GET',
					},
				...options
			};

			return new Promise((resolve, reject) => {

				const opts = _options;
				opts.timeout = timeout || this.timeout;

				const req = https.request(opts, (res) => {
					let resBody = '';
					res.on('data', (chunk) => {
						resBody += chunk;
					});
					res.once('end', () => {
						if (!res.complete) {
							return reject(Error('The connection was terminated while the message was still being sent'));
						}
						res.body = resBody;
						return resolve(res); // resolve the request
					});
				});
				req.on('error', (e) => {
					req.destroy();
					this.lastResponse = e;	// e.g. ECONNREFUSED on wrong soap port or wrong IP // ECONNRESET on wrong IP
					return reject(e);
				});
				req.on('timeout', () => {
					req.destroy();
				});
				// req.write(postData);
				req.end(postData);
			});
		}
		catch (e)
		{
		}
	}

	
	async setConfigMACReservation(p) {
		try {
			await this._configurationStarted();
			const message = soap.setConfigMACReservation(this.sessionId,p);
			const result = await this._queueMessage(soap.action.setConfigMACReservation, message);

			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});

			var resp = regexResponseCode.exec(result.body)[1] === '000';
			return Promise.resolve(resp);
		} catch (error) {
			return Promise.reject(error);
		}
	}


	async setWLANWPAPSKByPassphrase(p) {
		try {
			await this._configurationStarted();
			const message = soap.setWLANWPAPSKByPassphrase(this.sessionId,p);
			const result = await this._queueMessage(soap.action.setWLANWPAPSKByPassphrase, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	
	
	async set5GWLANWPAPSKByPassphrase(p) {
		try {
			await this._configurationStarted();
			const message = soap.set5GWLANWPAPSKByPassphrase(this.sessionId,p);
			const result = await this._queueMessage(soap.action.set5GWLANWPAPSKByPassphrase, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	

	async setAllGuestAccessEnabled(p) {
		try {
			await this._configurationStarted();
			const message = soap.setAllGuestAccessEnabled(this.sessionId,p);
			const result = await this._queueMessage(soap.action.setAllGuestAccessEnabled, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async set5GAllGuestAccessEnabled(p) {
		try {
			await this._configurationStarted();
			const message = soap.set5GAllGuestAccessEnabled(this.sessionId,p);
			const result = await this._queueMessage(soap.action.set5GAllGuestAccessEnabled, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	
	async setWireless3Enabled(p) {
		try {
			await this._configurationStarted();
			const message = soap.setWireless3Enabled(this.sessionId,p);
			const result = await this._queueMessage(soap.action.setWireless3Enabled, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async set5GWireless3Enabled(p) {
		try {
			await this._configurationStarted();
			const message = soap.set5GWireless3Enabled(this.sessionId,p);
			const result = await this._queueMessage(soap.action.set5GWireless3Enabled, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}


	async setGuestPortal(p) {
		try {
			await this._configurationStarted();
			const message = soap.setGuestPortal(this.sessionId,p);
			const result = await this._queueMessage(soap.action.setGuestPortal, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async set5GGuestPortal(p) {
		try {
			await this._configurationStarted();
			const message = soap.set5GGuestPortal(this.sessionId,p);
			const result = await this._queueMessage(soap.action.set5GGuestPortal, message);
			await this._configurationFinished()
				.catch(() => {
					console.log(`finished with warning`);
				});
			return Promise.resolve(true);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}

module.exports = ZoetisNetgearRouter;