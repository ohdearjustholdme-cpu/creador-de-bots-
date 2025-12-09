let commandCount = 0;

// ➜ Agregar comando
function addCommand() {
  commandCount++;

  const container = document.getElementById("commandsContainer");

  const div = document.createElement("div");
  div.className = "card p-4 mb-4";
  div.id = `cmd_${commandCount}`;

  div.innerHTML = `
    <label class="text-pink-600">Nombre del comando (sin /)</label>
    <input class="w-full p-2 rounded-md border mb-3 cmd-name" placeholder="ejemplo: bark" />

    <label class="text-pink-600">Descripción del comando</label>
    <input class="w-full p-2 rounded-md border mb-3 cmd-desc" placeholder="ejemplo: ladrar" />

    <label class="text-pink-600">Descripción de la mención</label>
    <input class="w-full p-2 rounded-md border mb-3 cmd-msg2" placeholder="ejemplo: ¿A quién le vas a ladrar? :3" />

    <label class="text-pink-600">Mensaje</label>
    <input class="w-full p-2 rounded-md border mb-3 cmd-msg" placeholder="ejemplo: {{autor}} ladra a {{usuario}} >⩊<!" />

    <label class="text-pink-600">GIFs (separados por coma)</label>
    <input class="w-full p-2 rounded-md border mb-3 cmd-gifs" placeholder="https://gif1.gif, https://gif2.gif" />

    <button onclick="removeCommand('${div.id}')" class="bg-red-400 text-white px-3 py-1 rounded-lg mt-2">
      Eliminar comando
    </button>
  `;

  container.appendChild(div);
}

// ➜ Eliminar comando
function removeCommand(id) {
  document.getElementById(id).remove();
}

// ➜ Generar código del bot
function generateBotCode() {
  let namebot = document.getElementById("botName").value || "MiBot";
  let actType = document.getElementById("activityType").value;
  let actText = document.getElementById("activityText").value || "";
  let status = document.getElementById("status").value;
  let color = document.getElementById("colorEmbed").value || "255,255,255";

  let code = `
import disnake
from disnake.ext import commands

intents = disnake.Intents.default()
intents.message_content = True

bot = commands.InteractionBot(intents=intents)

@bot.event
async def on_ready():
    activity = disnake.Activity(
        type=disnake.ActivityType.${actType.toLowerCase()},
        name="${actText}"
    )

    await bot.change_presence(
        status="${status}",
        activity=activity
    )
    print(f"{bot.user} listo!")
`;

  const commands = document.querySelectorAll("#commandsContainer > div");

  commands.forEach(cmd => {
    const name = cmd.querySelector(".cmd-name").value;
    const desc = cmd.querySelector(".cmd-desc").value;
    const msg = cmd.querySelector(".cmd-msg").value;
    const gifs = cmd.querySelector(".cmd-gifs").value.split(",");
    const msg2 = cmd.querySelector(".cmd-msg2").value;

    code += `
@bot.slash_command(description="${desc}")
async def ${name}(inter, usuario: disnake.Member = None):
    import random
    gifs = ${JSON.stringify(gifs)}
    gif = random.choice(gifs).strip()
    text = f"${msg}".replace("{{autor}}", inter.author.display_name).replace("{{usuario}}", usuario.display_name if usuario else "")
    embed = disnake.Embed(description=text, color=disnake.Color.from_rgb(${color})
    embed.set_image(url=gif)
    await inter.response.send_message(embed=embed)
`;
  });

  code += `

# Reemplaza TU_TOKEN_AQUI por el token de tu bot
bot.run("TU_TOKEN_AQUI")
`;

  return code;
}

// ➜ Vista previa
function generatePreview() {
  document.getElementById("preview").classList.remove("hidden");
  document.getElementById("previewCode").textContent = generateBotCode();
}

