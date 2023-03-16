# SO1_PRACTICA2_202010055

La aplicacion consiste en un dashboard donde se puede obtener informacion sobre la memoria RAM y CPU de la computadora mediante llamadas al kernel de esta con modulos escritos en C. Estos datos son posteriormente almacenados en una base de datos de MySQL para luego ser mostrados en una webapp.

La aplcacion se compone de 5 partes:
- Modulos de kernel para lectura de datos de la RAM y CPU
- Aplicacion de Golang para leer los datos recabados
- Base de datos en MySQL para almacenar los datos
- API en Node.js para recuperar los datos de la base de datos
- App en React para mostrar los datos

Estos componentes estaran dentro de contenedores de docker y podran ser levantados en cualquier dispositivo con docker instalado utilizando docker compose.

## Modulos de Kernel
Estos modulos son 2 programas escritos en C que realizaran llamadas al kernel del sistema para obtener informacion del equipo.

### Modulo RAM
Este modulo utilizara la libreria de C ```<linux/sysinfo.h>``` para obtener informacion del estado actual de la memoria RAM.

El modulo de kernel inicia debe de tener 2 metodos principales, uno que le dira que hacer cuando es montado y otro que le dira que hacer cuando es desmontado. Estos son los siguientes:

```C

static int _insert(void)
{
    proc_create("ram_202010055", 0, NULL, &operaciones);
    printk(KERN_INFO "202010055\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202010055", NULL);
    printk(KERN_INFO "Sistemas_Operativos_1\n");
    
}


module_init(_insert);
module_exit(_remove);
``` 
En este caso, cuando sea montado se imprimira a la infroamcion del Kernel un mensaje y se especificara un struct con las operaciones que realizara el kernel cuando algun programa interactue con el:

```C
static struct proc_ops operaciones =
{
    .proc_open = abrir,
    .proc_read = seq_read
};
``` 
En este caso, cuuando el modulo sea abierto se ejecutara el metodo ```abrir``` y cuando sea leido (por un programa como ```cat```) escribira en la terminal un texto.

Cuando el programa es abierto se debera leer al kernel, esto se hara por medio de la libreria ```<linux/sysinfo.h>```, esta posee un struct llamado ```task_struct``` donde se puede obtener informacion de la memoria ram.

```C
static int escribir(struct seq_file *archivo, void *v)
{
    struct sysinfo info;
    si_meminfo(&info);
         
    // Buffer, Free, Total, Unit
    seq_printf(archivo, "%lu,%lu,%lu,%d\n",info.bufferram ,info.freeram, info.totalram, info.mem_unit);
    
    return 0;
}
``` 
En este metodo lo primero que se hace es definir una instancia de ```task_struct```, luego se llama al metodo ```si_meminfo()``` que lo que hara es llenar el ```task_struct``` con la informacion actual del kernel.

Luego solo se toman los datos que nos concernen y se escriben en el archivo de salida.

### Modulo CPU
Este modulo tendra como funcion obtener informacion del CPU. 

Al igual que el modulo anterior se define las funciones de montado y desmontado del modulo.

```C
static int _insert(void)
{   
    timer_setup(&timer, timer_callback, 0);
    mod_timer(&timer, jiffies + HZ);

    proc_create("cpu_202010055", 0, NULL, &operaciones);
    printk(KERN_INFO "Derek Esquivel\n");
    return 0;
}

static void _remove(void)
{
    del_timer(&timer);

    remove_proc_entry("cpu_202010055", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
    
}

module_init(_insert);
module_exit(_remove);

``` 
Con la diferencia que en este caso deberemos iniciar un ```timer```, este tendra como funcion hacer que el proceso ```timer_callback``` se ejecute contantemente cada segundo, la razon de esto sera explicada a continuacion.

La primera parte del modulo sera la de la obtencion de los procesos

```C
<linux/sysinfo.h>
``` 