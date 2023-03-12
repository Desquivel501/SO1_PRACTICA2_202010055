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

#include <linux/sched.h>
#include <linux/sched/signal.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Sistemas Operativos 1 - Practica 2 - Modulo CPU");
MODULE_AUTHOR("Derek Esquivel Diaz");

void getProcesses(struct task_struct *task, struct seq_file *archivo) {
	struct task_struct *child;
	struct list_head *list; 
    /* "Process ID, User ID, Process Name, State, Parent */
	seq_printf(archivo, "%d,%d,%-20s,%d,%d\n",task->pid, task->cred->uid,task->comm, task->__state, task->parent->pid);
	list_for_each(list, &task->children) { 
		child = list_entry(list, struct task_struct, sibling);
		getProcesses(child, archivo);
	}
}


static int escribir(struct seq_file *archivo, void *v)
{   
    getProcesses(&init_task, archivo); 
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
    proc_create("cpu_202010055", 0, NULL, &operaciones);
    printk(KERN_INFO "Derek Esquivel\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_202010055", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
    
}

module_init(_insert);
module_exit(_remove);