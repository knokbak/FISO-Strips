/*
 * Virtual FISO Strips application
 * Copyright (C) 2023 Vionity Ltd
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import IndexPage from './pages/index';
import NewStripPage from './pages/new-strip';

console.time(`Render: ${document.body.id}`);

switch (document.body.id) {
    case 'page-index':
        IndexPage();
        break;
    case 'page-new-strip':
        NewStripPage();
        break;
    default:
        const error = new Error(`Unknown page: ${document.body.id}`);
        console.error(document.body);
        alert(error);
        throw error;
}

console.timeEnd(`Render: ${document.body.id}`);
