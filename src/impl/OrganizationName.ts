/// <reference path="../collections.ts" />

'use strict';

import basarat = require('../collections');
import collections = basarat.collections;

import {OrganizationName} from "../api/OrganizationName";

import {PartyNameImpl} from "./PartyName";

/**
 ***************************************************************************************************
 * Represents the name of an Organization
 *
 * @author  <a href="mailto:philippe.paravicini@janux.org">Philippe Paravicini</a>
 * @version $Revision: 1.5 $ - $Date: 2006-11-14 01:30:39 $
 ***************************************************************************************************
 */
export class OrganizationNameImpl extends PartyNameImpl implements OrganizationName {
	//private shortName: string;
	//private longName: string;
	private legal: string;

	public getShort(): string {
		return this.shortName;
	}

	public setShort(s: string): void {
		this.shortName = s;
	}

	public getLong(): string {
		return this.longName;
	}

	public setLong(s: string): void {
		this.longName = s;
	}

	public getLegal(): string {
		return this.legal;
	}

	public setLegal(legal: string): void {
		this.legal = legal;
	}

	public tostring(): string {
		// Short hand. Adds each own property
		return collections.makeString(this);
	}

	//
	//public Object clone() {
	//	OrganizationNameImpl result = (OrganizationNameImpl) super.clone();
	//	return (result);
	//}

} // end class OrganizationNameImpl