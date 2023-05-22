'use strict';

const http = require('http');
const https = require('https');
const parseXml = require('xml-js');
const Queue = require('smart-request-balancer');
const util = require('util');
const dns = require('dns');
const dgram = require('dgram');
const os = require('os');
const soap = require('./soapcalls_zoetis');
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


		async api_get(apicall)
		{
			try
			{
				const message = soapZoetis[apicall](this.sessionId);
				var result = await this._queueMessage(soapZoetis.action[apicall], message);

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
							obj[i_property] = rawJson['v:Envelope']['v:Body'][property][i_property]._text;
						}
					);
				}
			}
		}
	);

	return (obj);
	}
}

module.exports = ZoetisNetgearRouter;
