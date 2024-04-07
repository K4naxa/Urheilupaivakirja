/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("news").del();
  await knex("news").insert([
    {
      teacher_id: 1,
      title: "Otsikko",
      content: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget luctus ipsum. Cras volutpat elementum ipsum, id tincidunt diam fermentum id. Curabitur imperdiet nisl vitae libero imperdiet sollicitudin. Integer nibh massa, posuere vestibulum faucibus quis, bibendum eget enim. Cras at nisi arcu. Suspendisse nunc nisl, euismod vitae faucibus tristique, ullamcorper vulputate turpis. Proin maximus augue quis nibh rhoncus, dignissim consequat justo molestie. Phasellus molestie iaculis scelerisque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque mattis laoreet justo vel faucibus. Curabitur vitae venenatis ligula. Etiam vitae laoreet velit. Nunc ac tellus bibendum felis euismod viverra.",
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      teacher_id: 1,
      title: "Otsikko numero 2",
      content: " Sed viverra lectus at volutpat vestibulum. In sed tellus in diam vehicula sollicitudin. Phasellus tincidunt ligula ut lorem suscipit eleifend. Etiam quis malesuada risus. Sed cursus ullamcorper purus non porttitor. Sed vel orci in nulla fermentum consequat vel vel turpis. Fusce a vestibulum nulla. Aliquam fringilla ut purus eget aliquam. Sed sollicitudin nisi vitae dolor maximus, condimentum malesuada diam congue. Duis pulvinar vitae arcu non iaculis. Nullam tincidunt libero risus, in posuere nibh consequat ut.",
      created_at: new Date(2024, 2, 2, 18, 0),
    },
    {
      teacher_id: 1,
      title: "Joku otsikko tässä on",
      content: "Jotain sisältöä myös",
      created_at: new Date(2024, 4, 1, 16, 0),
    },
  ]);
};
