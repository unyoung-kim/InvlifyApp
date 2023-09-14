/* eslint-disable no-restricted-globals */

import React from 'react';

const LICENSE_TEXT = `THIS END USER LICENSE AGREEMENT (the "Agreement") is made and entered into by and between Invlify Inc., an Illinois, United States Limited Liability Company ("Licensor"), and any person or entity who uses the Invlify App (the "Licensee"). The "Software" refers to the Invlify App, which integrates Quickbooks' accounting features to help users create invoices.

PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING THE SOFTWARE. BY USING THE SOFTWARE, YOU ARE AGREEING TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO THE TERMS OF THIS AGREEMENT, DO NOT USE THE SOFTWARE.

GRANT OF LICENSE: Subject to the terms of this Agreement, Licensor grants Licensee a non-exclusive, non-transferable, revocable, limited license to use the Software for Licensee's internal business purposes.

RESTRICTIONS ON USE: The Licensee shall not: (a) modify, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Software; (b) circumvent any user limits or other timing, use or functionality restrictions built into the Software; (c) remove any proprietary notices, labels, or marks on the Software; or (d) lease, rent, or sublicense the Software.

INTELLECTUAL PROPERTY: All rights, titles, interests, copyrights and intellectual property rights in and to the Software and any copies of the Software are owned by the Licensor and/or its suppliers.

NO WARRANTIES: The Software is provided "AS IS" without warranty of any kind. Licensor disclaims all warranties, either express or implied, including but not limited to, warranties of merchantability, fitness for a particular purpose and non-infringement.

LIMITATION OF LIABILITY: In no event shall Licensor be liable for any damages (including, without limitation, lost profits, business interruption, or lost information) rising out of 'Authorized Users' use of or inability to use the Software.

TERM AND TERMINATION: This Agreement is effective until terminated by either party. Licensee's rights under this Agreement will terminate automatically without notice from the Licensor if the Licensee fails to comply with any term(s) of this Agreement.

GOVERNING LAW: This Agreement is governed by and construed in accordance with the laws of Illinois without regard to its conflict of laws rules.`;

const EndUserLicense = () => {
  return (
    <div style={{ marginLeft: 12, marginRight: 12 }}>
      <h1>END USER LICENSE AGREEMENT</h1>
      <p style={{ whiteSpace: 'break-spaces' }}>{LICENSE_TEXT}</p>
    </div>
  );
};

export default EndUserLicense;
