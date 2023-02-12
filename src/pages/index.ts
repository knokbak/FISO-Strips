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

export default function IndexPage() {
    let counter = 0;

    (window as any).allowDrop = (ev: DragEvent) => {
        ev.preventDefault();
    }
      
    (window as any).drag = (ev: DragEvent) => {
        ev.dataTransfer!.setData('text', (ev.target as any).id);
    }
      
    (window as any).drop = (ev: DragEvent) => {
        ev.preventDefault();
        const data = ev.dataTransfer!.getData('text') as string;
        console.log(data, ev.target);
        (ev.target as HTMLElement).appendChild(document.getElementById(data)!);
    }
    
    (window as any).changeInputToSpan = (ev: InputEvent, isBlur: boolean) => {
        const target = (ev.target as HTMLInputElement);
        if (target.value === '') {
            target.parentElement?.parentElement?.remove();

            return;
        }
        if (isBlur) {
            const span = document.createElement('span');
            span.innerText = target.value.toUpperCase();
            span.addEventListener('contextmenu', (ev) => (window as any).changeSpanToInput(ev));
            target.parentElement!.appendChild(span);
            target.remove();
        } else {
            target.blur();
        }
    }
    
    (window as any).changeSpanToInput = (ev: Event, placeholder?: string) => {
        ev.preventDefault();
        const target = (ev.target as HTMLSpanElement);
        const originalText = target.innerText.toUpperCase();
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder ?? '';
        input.value = originalText;
        input.addEventListener('change', (ev) => (window as any).changeInputToSpan(ev, false));
        input.addEventListener('blur', (ev) => (window as any).changeInputToSpan(ev, true));
        input.addEventListener('keyup', (ev) => {
            switch (ev.key) {
                case 'Enter':
                    (window as any).changeInputToSpan(ev, false);
                    break;
                case 'Escape':
                    input.value = originalText;
                    (window as any).changeInputToSpan(ev, false);
                    break;
                case 'Delete':
                    input.parentElement?.parentElement?.remove();
                    break;
                default:
                    break;
            }
        });
        target.parentElement!.appendChild(input);
        target.remove();
        input.focus();
        input.select();
    }
    
    (window as any).createAircraftStrip = (ev: MouseEvent, display: 'arrival' | 'departure' | 'local') => {
        const node = document.createElement('div');
        node.id = `ac-strip-${counter++}`;
        node.classList.value = `strip ${display}`;
        node.draggable = true;
        node.addEventListener('dragstart', (ev) => (window as any).drag(ev));
        node.innerHTML = `
        <div class="aircraft-strip-content p13">
            <div class="aircraft-strip-data">
                <textarea placeholder="DEPT"></textarea>
            </div>
            <div class="aircraft-strip-data">
                <textarea placeholder="DEST"></textarea>
            </div>
        </div>
        <div class="aircraft-strip-content p25">
            <input type="text" placeholder="CALLSIGN" onchange="changeInputToSpan(event, false)" onblur="changeInputToSpan(event, true)" onkeyup="if(event.key === 'Enter'){changeInputToSpan(event, false)}" />
        </div>
        <div class="aircraft-strip-content p13">
            <div class="aircraft-strip-data">
                <textarea placeholder="FR"></textarea>
            </div>
            <div class="aircraft-strip-data">
                <textarea placeholder="TYPE"></textarea>
            </div>
        </div>
        <div class="aircraft-strip-content p13">
            <div class="aircraft-strip-data">
                <textarea placeholder="ATT"></textarea>
            </div>
            <div class="aircraft-strip-data">
                <textarea placeholder="ATD"></textarea>
            </div>
        </div>
        <div class="aircraft-strip-content p13">
            <div class="aircraft-strip-data">
                <textarea placeholder="LPOS"></textarea>
            </div>
            <div class="aircraft-strip-data">
                <textarea placeholder="LTIM"></textarea>
            </div>
        </div>
        <div class="aircraft-strip-content p33">
            <textarea style="padding: 2px 0 !important"></textarea>
        </div>
        `;
        (ev.target as HTMLElement).parentElement!.children[1].appendChild(node);

        const elem = (ev.target as HTMLElement).parentElement!.children[1];
        (elem.children[elem.children.length - 1].children[1].children[0] as any).focus();
        
        //(ev.target as HTMLElement).parentElement!.children[1].appendChild(node);
    }

}
