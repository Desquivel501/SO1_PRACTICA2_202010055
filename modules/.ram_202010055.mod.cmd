cmd_/home/desquivel/Documents/SO1_PRACTICA2_202010055/modules/ram_202010055.mod := printf '%s\n'   ram_202010055.o | awk '!x[$$0]++ { print("/home/desquivel/Documents/SO1_PRACTICA2_202010055/modules/"$$0) }' > /home/desquivel/Documents/SO1_PRACTICA2_202010055/modules/ram_202010055.mod
