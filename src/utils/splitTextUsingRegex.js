// function split_string_con_regex(string) {
//     const chars = []
//     const regex = /[\s\S]/g; // Este regex coincide con cualquier carácter, 
//     // incluyendo saltos de línea

//     let match;
//     while ((match = regex.exec(string)) !== null) {
//         chars.push(match[0]);
//     }
//     return chars;
// }

export default function split_array_of_strings(array) {
    // Array.from('HOLA') devuelve ['H', 'O', 'L', 'A']
    return array.map(str => Array.from(str));
}


