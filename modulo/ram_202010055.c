#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>
//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

#include <linux/sysinfo.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Sistemas Operativos 1 - Practica 2 - Modulo RAM");
MODULE_AUTHOR("Derek Esquivel Diaz");


static int escribir(struct seq_file *archivo, void *v)
{
    struct sysinfo info={};
    seq_printf(archivo, "Total RAM: %lu \n", info.totalram * info.mem_unit);
    seq_printf(archivo, "Free RAM: %lu \n", info.freeram);
    seq_printf(archivo, "Used RAM: %lu \n", info.totalram - info.freeram);
    return 0;
}


static int abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir, NULL);
}


static struct proc_ops operaciones =
{
    .proc_open = abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("ram_202010055", 0, NULL, &operaciones);
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202010055", NULL);
    printk(KERN_INFO "Sistemas_Operativos_1\n");
    
}

module_init(_insert);
module_exit(_remove);