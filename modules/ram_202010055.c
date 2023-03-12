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

// #include <linux/sysinfo.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Sistemas Operativos 1 - Practica 2 - Modulo RAM");
MODULE_AUTHOR("Derek Esquivel Diaz");

static int escribir(struct seq_file *archivo, void *v)
{
    struct sysinfo info;
    
    seq_printf(archivo, "%lu,%lu\n", info.freeram, info.totalram);

    // seq_printf(archivo, "Total Ram: %lluk\tFree: %lluk\n",
    //             info.totalram *(unsigned long long)info.mem_unit / 1024,
    //             info.freeram *(unsigned long long)info.mem_unit/ 1024);

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